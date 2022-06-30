import { HALF_UNIT_SIZE, UNIT_SCALE, UNIT_SIZE } from './Constants';
import { API_ADDRESS } from '../constants';
import { Player } from './Player';

import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP, RoomType, simpleDungeonGenerator } from './SimpleDungeonGenerator';
import { createTile, loadTiles } from './TileManager';
import { TreasureChest } from './TreasureChest';
import { Vector2 } from './utils';
import toast from 'react-hot-toast';

const triggerRewardAllocation = async (account: string, defenderId: string | number) => {
  const res = await fetch(`${API_ADDRESS}/v1/game/${account}/allocateRewards`, { method: 'POST' });
  if (res.status !== 200)
    toast.error('Failed to allocate rewards, emergency withdrawal needed', { position: 'top-right' });

  toast.success('You won, GG !', {
    icon: '✅',
    position: 'top-right',
  });
  window.location.href = `/NFT/${defenderId}`;
};

const DUNGEON_SIZE = 3;
const NUM_OF_ROOMS = 5;
const SPAWN_ROOM_SIZE = 8;
const ENEMY_ROOM_SIZE = 12;
const BOSS_ROOM_SIZE = 6;

const CELL_SIZE = 16;

export class GameScene extends Phaser.Scene {
  floorLayer!: Phaser.GameObjects.Layer;
  wallLayer!: Phaser.GameObjects.Layer;
  gameLayer!: Phaser.GameObjects.Layer;

  staticPhysicGroup!: Phaser.Physics.Arcade.StaticGroup;
  enemyPhysicGroup!: Phaser.Physics.Arcade.Group;

  player: Player;
  treasureChest: TreasureChest;

  prevIsDown: boolean;
  cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;

  graphics!: Phaser.GameObjects.Graphics;
  lines: Phaser.Curves.Line[] = [];
  edges: Phaser.Curves.Line[] = [];

  constructor() {
    super('Game');
    this.player = new Player();
    this.treasureChest = new TreasureChest();
    this.prevIsDown = false;
  }

  preload() {
    Player.preload(this);
    TreasureChest.preload(this);
    loadTiles(this);
  }

  createRoom(cx: number, cy: number, size: number, hallways: boolean[]) {
    let halfSize = size / 2;
    const lastCol = size - 1;
    const lastRow = lastCol;
    let tl = new Vector2(cx - size * HALF_UNIT_SIZE, cy - size * HALF_UNIT_SIZE);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let tile = 0;
        if (x === 0 || x === lastCol) {
          // left and right walls
          tile = 0;

          if (
            ((hallways[DIR_LEFT] && x === 0) || (hallways[DIR_RIGHT] && x === lastCol)) &&
            y >= halfSize - 2 &&
            y <= halfSize + 1
          ) {
            continue;
          }
        } else if (y === 0) {
          // top
          tile = 9;

          if (hallways[DIR_UP] && x >= halfSize - 1 && x <= halfSize) {
            continue;
          }
        } else if (y === lastRow) {
          // bottom
          tile = 62;

          if (hallways[DIR_DOWN] && x >= halfSize - 1 && x <= halfSize) {
            continue;
          }
        } else {
          // floor
          tile = 29;
        }

        createTile(this, tl.x + x * UNIT_SIZE, tl.y + y * UNIT_SIZE, tile, {
          layer: tile === 29 ? this.floorLayer : this.wallLayer,
          physicsGroup: tile !== 29 ? this.staticPhysicGroup : undefined,
          addCollision: tile !== 29,
        });
      }
    }

    tl = new Vector2(cx - CELL_SIZE * HALF_UNIT_SIZE, cy - CELL_SIZE * HALF_UNIT_SIZE);
    halfSize = CELL_SIZE / 2;
    const roadLength = (CELL_SIZE - size) / 2;
    for (let x = 0; x < CELL_SIZE; x++) {
      if (x > roadLength && x < size + roadLength - 1) {
        // not valid hallway location
        continue;
      }

      if (x <= roadLength && !hallways[DIR_LEFT]) {
        // no ups hallway
        continue;
      }

      if (x >= size + roadLength - 1 && !hallways[DIR_RIGHT]) {
        // no down hallway
        continue;
      }

      createTile(this, tl.x + x * UNIT_SIZE, tl.y + (halfSize - 2) * UNIT_SIZE, 9, {
        layer: this.wallLayer,
        physicsGroup: this.staticPhysicGroup,
        addCollision: true,
      });
      createTile(this, tl.x + x * UNIT_SIZE, tl.y + (halfSize - 1) * UNIT_SIZE, 29, {
        layer: this.floorLayer,
      });
      createTile(this, tl.x + x * UNIT_SIZE, tl.y + halfSize * UNIT_SIZE, 29, {
        layer: this.floorLayer,
      });
      createTile(this, tl.x + x * UNIT_SIZE, tl.y + (halfSize + 1) * UNIT_SIZE, 62, {
        layer: this.wallLayer,
        physicsGroup: this.staticPhysicGroup,
        addCollision: true,
      });
    }

    for (let y = 0; y < CELL_SIZE; y++) {
      if (y > roadLength && y < size + roadLength - 1) {
        // not valid hallway location
        continue;
      }

      if (y <= roadLength && !hallways[DIR_UP]) {
        // no ups hallway
        continue;
      }

      if (y >= size + roadLength - 1 && !hallways[DIR_DOWN]) {
        // no down hallway
        continue;
      }

      createTile(this, tl.x + (halfSize - 2) * UNIT_SIZE, tl.y + y * UNIT_SIZE, 0, {
        layer: this.wallLayer,
        physicsGroup: this.staticPhysicGroup,
        addCollision: true,
      });
      createTile(this, tl.x + (halfSize - 1) * UNIT_SIZE, tl.y + y * UNIT_SIZE, 29, {
        layer: this.floorLayer,
      });
      createTile(this, tl.x + halfSize * UNIT_SIZE, tl.y + y * UNIT_SIZE, 29, {
        layer: this.floorLayer,
      });
      createTile(this, tl.x + (halfSize + 1) * UNIT_SIZE, tl.y + y * UNIT_SIZE, 0, {
        layer: this.wallLayer,
        physicsGroup: this.staticPhysicGroup,
        addCollision: true,
      });
    }
  }

  create() {
    this.graphics = this.add.graphics();

    this.floorLayer = this.add.layer();
    this.wallLayer = this.add.layer();
    this.gameLayer = this.add.layer();

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.staticPhysicGroup = this.physics.add.staticGroup();
    this.enemyPhysicGroup = this.physics.add.group();

    const map = simpleDungeonGenerator(DUNGEON_SIZE, NUM_OF_ROOMS);

    let isGameOver = false;
    const onGameOver = () => {
      if (isGameOver) {
        return;
      }

      isGameOver = true;
      const { owner, defenderId } = this.scene.settings.data as { owner: string; defenderId: number };
      triggerRewardAllocation(owner, defenderId);
    };

    for (let y = 0; y < DUNGEON_SIZE; y++) {
      for (let x = 0; x < DUNGEON_SIZE; x++) {
        const cell = map[y][x];
        const pos = new Vector2(x * CELL_SIZE * UNIT_SIZE, y * CELL_SIZE * UNIT_SIZE);

        let roomSize;
        switch (cell.roomType) {
          case RoomType.NONE:
            continue;
          case RoomType.SPAWN_ROOM:
            roomSize = SPAWN_ROOM_SIZE;
            this.player.create(this, this.gameLayer, pos.x, pos.y);
            break;
          case RoomType.ENEMY_ROOM:
            roomSize = ENEMY_ROOM_SIZE;
            break;
          case RoomType.BOSS_ROOM:
            roomSize = BOSS_ROOM_SIZE;
            this.treasureChest.create(this, this.gameLayer, pos.x, pos.y, onGameOver);
            break;
        }

        this.createRoom(pos.x, pos.y, roomSize, cell.hallways);
      }
    }

    this.physics.add.collider(this.player.sprite, this.staticPhysicGroup);
    this.physics.add.overlap(this.player.sprite, this.treasureChest.sprite, () => {
      this.treasureChest.open();
    });
  }

  update() {
    this.player.update(this, this.cursorKeys);
  }
}
