import './index.css';

import Phaser from 'phaser';
import { GAME_CONFIG } from './Constants';

export function initializeGame(containerId: string) {
    const config = {...GAME_CONFIG, parent: containerId}
    return new Phaser.Game(config);
}