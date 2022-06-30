import './index.css';

import Phaser from 'phaser';
import { GAME_CONFIG } from './Constants';
import toast from 'react-hot-toast';

export function initializeGame(containerId: string, stakeState: any) {
  if (!stakeState) {
    toast.error('Unauthorized', { icon: '❌', position: 'top-right' });
    window.location.href = '/';
  }

  const config = { ...GAME_CONFIG, parent: containerId };
  const game = new Phaser.Game(config);
  game.scene.start('Game', stakeState);
}
