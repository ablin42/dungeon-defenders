import './index.css';

import Phaser from 'phaser';
import { GAME_CONFIG } from './Constants';
import toast from 'react-hot-toast';
import { Defender, Loot } from '../hooks';

export type GameConfig = {
  ownerAddress: string,
  defenderId: string | number,
  defender: Defender,
  weapon: Loot
}

export function initializeGame(containerId: string, state: GameConfig) {
  if (!state) {
    toast.error('Unauthorized', { icon: '❌', position: 'top-right' });
  }

  const config = { ...GAME_CONFIG, parent: containerId };
  const game = new Phaser.Game(config);
  game.scene.start('Game', state);
}
