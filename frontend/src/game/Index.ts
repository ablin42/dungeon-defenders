import './index.css';

import Phaser from 'phaser';
import { GAME_CONFIG } from './Constants';

export function initializeGame(containerId: string, STAKE_STATE: any) {
  const config = { ...GAME_CONFIG, parent: containerId, STAKE_STATE };
  return new Phaser.Game(config);
}
