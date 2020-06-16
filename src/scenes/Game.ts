import Phaser from 'phaser'

import Paddle from '../game/Paddle'

const colors = [
	0xff0000,
	0x00ff00,
	0x0000ff
]

export default class Game extends Phaser.Scene
{
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
	private paddle!: Paddle
	private ball!: Phaser.Physics.Matter.Image

	private livesLabel!: Phaser.GameObjects.Text
	private lives = 3

	private blocks: Phaser.Physics.Matter.Sprite[] = []

	constructor()
	{
		super('game')
	}

	init()
	{
		this.cursors = this.input.keyboard.createCursorKeys()

		this.lives = 3
	}

	create()
	{
		const { width, height } = this.scale

		const map = this.make.tilemap({ key: 'level1' })
		const tileset = map.addTilesetImage('block', 'block')

		map.createStaticLayer('Level', tileset)

		this.blocks = map.createFromTiles(1, 0, { key: 'block' })
			.map(go => {
				go.x += go.width * 0.5
				go.y += go.height * 0.5

				const block = this.matter.add.gameObject(go, { isStatic: true }) as Phaser.Physics.Matter.Sprite
				block.setData('type', 'block')
				block.setTint(colors[Phaser.Math.Between(0, colors.length - 1)])
				return block 
			})

		this.ball = this.matter.add.image(400, 300, 'ball', undefined, {
			circleRadius: 12
		})

		const body = this.ball.body as MatterJS.BodyType
		this.matter.body.setInertia(body, Infinity)
		this.ball.setFriction(0, 0)
		this.ball.setBounce(1)

		this.paddle = new Paddle(this.matter.world, width * 0.5, height * 0.9, 'paddle', {
			isStatic: true,
			chamfer: {
				radius: 15
			}
		})

		this.paddle.attachBall(this.ball)

		this.livesLabel = this.add.text(10, 10, `Lives: ${this.lives}`, {
			fontSize: 24
		})

		this.ball.setOnCollide(this.handleBallCollide.bind(this))
	}

	private handleBallCollide(data: Phaser.Types.Physics.Matter.MatterCollisionData)
	{
		const { bodyA } = data

		if (!bodyA.gameObject)
		{
			return
		}

		const goA = bodyA.gameObject as Phaser.GameObjects.GameObject

		if (goA.getData('type') !== 'block')
		{
			return
		}

		const idx = this.blocks.findIndex(block => block === goA)
		if (idx >= 0)
		{
			this.blocks.splice(idx, 1)
		}

		this.sound.play('tone1')
		goA.destroy(true)

		if (this.blocks.length <= 0)
		{
			this.scene.start('game-over', { title: 'You Win', color: '#e1eb34' })
		}
	}

	update(t: number, dt: number)
	{
		if (this.ball.y > this.scale.height + 100)
		{
			--this.lives
			this.livesLabel.text = `Lives: ${this.lives}`

			if (this.lives <= 0)
			{
				this.scene.start('game-over', { title: 'Game Over' })
				return
			}

			this.paddle.attachBall(this.ball)
			return
		}

		const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.space!)
		if (spaceJustDown)
		{
			this.paddle.launch()
		}

		this.paddle.update(this.cursors)
	}
}