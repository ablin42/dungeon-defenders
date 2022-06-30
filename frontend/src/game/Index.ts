import './index.css';

import Phaser from 'phaser';
import { GAME_CONFIG } from './Constants';

export function initializeGame(containerId: string, stakeState: any) {
  const config = { ...GAME_CONFIG, parent: containerId };
  const game = new Phaser.Game(config);
  game.scene.start('Game', stakeState);
}
