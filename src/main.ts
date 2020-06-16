import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import GameOver from './scenes/GameOver'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'matter',
		matter: {
			debug: {
				boundsColor: 0xff0000,
				lineColor: 0xff0000,
				staticLineColor: 0xff0000
			},
			gravity: { y: 0 },
			setBounds: {
				left: true,
				right: true,
				top: true,
				bottom: false
			}
		}
	},
	scene: [Preloader, Game, GameOver],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)
