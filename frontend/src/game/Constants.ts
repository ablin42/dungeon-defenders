import * as NineSlicePlugin from 'phaser3-nineslice';
import { GameScene } from './GameScene';
import { MainMenuScene } from './MainMenuScene';

export const UNIT_SIZE = 48;
export const HALF_UNIT_SIZE = UNIT_SIZE / 2;
export const UNIT_SCALE = UNIT_SIZE / 16;


export const GAME_CONFIG : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    pixelArt: true,
    backgroundColor: '#444444',
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
        }
    },
    plugins: {	// add to plugins.global 👇
		global: [ NineSlicePlugin.Plugin.DefaultCfg ]
	},
    scene: [MainMenuScene, GameScene]
};