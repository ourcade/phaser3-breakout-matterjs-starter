import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene
{
	constructor()
	{
		super('preloader')
	}

	preload()
	{
		this.load.image('ball', 'assets/ball.png')
		this.load.image('paddle', 'assets/paddle.png')
		this.load.image('block', 'assets/block.png')

		this.load.audio('tone1', 'assets/tone1.wav')

		this.load.tilemapTiledJSON('level1', 'levels/level1.json')
	}

	create()
	{
		this.scene.start('game')
	}
}
