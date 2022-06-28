import { HALF_UNIT_SIZE, UNIT_SCALE, UNIT_SIZE } from "./Constants";
import { Player } from "./Player";

import { RoomType, simpleDungeonGenerator } from "./SimpleDungeonGenerator";
import { loadTiles } from "./TileManager";

const DUNGEON_SIZE = 9;
const NUM_OF_ROOMS = 16;
const SPAWN_ROOM_SIZE = 8;
const ENEMY_ROOM_SIZE = 10; 
const BOSS_ROOM_SIZE = 14;

const CELL_SIZE = BOSS_ROOM_SIZE;

export class SimpleDungeonGenerationScene extends Phaser.Scene
{
    floorLayer!: Phaser.GameObjects.Layer;
    wallLayer!: Phaser.GameObjects.Layer;
    gameLayer!: Phaser.GameObjects.Layer;

    staticPhysicGroup!: Phaser.Physics.Arcade.StaticGroup;
    enemyPhysicGroup!: Phaser.Physics.Arcade.Group;

    player: Player;

    prevIsDown: boolean;
    cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;

    graphics!: Phaser.GameObjects.Graphics;
    lines: Phaser.Curves.Line[] = [];
    edges: Phaser.Curves.Line[] = [];

    constructor ()
    {
        super('');
        this.player = new Player();
        this.prevIsDown = false;
    }
 
    preload ()
    {
        Player.preload(this);
        loadTiles(this);
    }
    
    create ()
    {
        this.graphics = this.add.graphics();

        this.floorLayer = this.add.layer();
        this.gameLayer = this.add.layer();
        this.wallLayer = this.add.layer();

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.staticPhysicGroup = this.physics.add.staticGroup();
        this.enemyPhysicGroup = this.physics.add.group();

        const map = simpleDungeonGenerator(DUNGEON_SIZE, NUM_OF_ROOMS);

        for (let y = 0; y < DUNGEON_SIZE; y++) {
            for (let x = 0; x < DUNGEON_SIZE; x++) {
                const cell = map[y][x];

                let rect;
                let roadLength: number = 0;
                switch (cell.roomType) {
                    case RoomType.NONE:
                        rect = this.add.rectangle(x * CELL_SIZE * UNIT_SIZE, y * CELL_SIZE * UNIT_SIZE, (CELL_SIZE - 2) * UNIT_SIZE, (CELL_SIZE - 2) * UNIT_SIZE);
                        rect.setStrokeStyle(2, 0xffffff);
                        break;
                    case RoomType.SPAWN_ROOM:
                        rect = this.add.rectangle(x * CELL_SIZE * UNIT_SIZE, y * CELL_SIZE * UNIT_SIZE, SPAWN_ROOM_SIZE * UNIT_SIZE, SPAWN_ROOM_SIZE * UNIT_SIZE);
                        rect.setStrokeStyle(2, 0x00ff00);
                        rect.setFillStyle(0x00ff00);
                        roadLength = CELL_SIZE - SPAWN_ROOM_SIZE;
                        this.player.create(this, this.gameLayer, x * CELL_SIZE * UNIT_SIZE, y * CELL_SIZE * UNIT_SIZE);
                        break;
                    case RoomType.ENEMY_ROOM:
                        rect = this.add.rectangle(x * CELL_SIZE * UNIT_SIZE, y * CELL_SIZE * UNIT_SIZE, ENEMY_ROOM_SIZE * UNIT_SIZE, ENEMY_ROOM_SIZE * UNIT_SIZE);
                        rect.setStrokeStyle(2, 0x0000ff);
                        rect.setFillStyle(0x0000ff);
                        roadLength = CELL_SIZE - ENEMY_ROOM_SIZE;
                        break;
                    case RoomType.BOSS_ROOM:
                        rect = this.add.rectangle(x * CELL_SIZE * UNIT_SIZE, y * CELL_SIZE * UNIT_SIZE, BOSS_ROOM_SIZE * UNIT_SIZE, BOSS_ROOM_SIZE * UNIT_SIZE);
                        rect.setStrokeStyle(2, 0xff0000);
                        rect.setFillStyle(0xff0000);
                        roadLength = CELL_SIZE - BOSS_ROOM_SIZE;
                        break;
                }

                roadLength /= 2;
                const roadOffset = CELL_SIZE / 2 - roadLength / 2;
                if (cell.hallways[0]) {
                    const r = this.add.rectangle(x * CELL_SIZE * UNIT_SIZE, y * CELL_SIZE * UNIT_SIZE - roadOffset * UNIT_SIZE, 2 * UNIT_SIZE, roadLength * UNIT_SIZE);
                    r.setStrokeStyle(2, 0xffffff);
                    r.setFillStyle(0xffffff);
                }
                if (cell.hallways[1]) {
                    const r = this.add.rectangle(x * CELL_SIZE * UNIT_SIZE + roadOffset * UNIT_SIZE, y * CELL_SIZE * UNIT_SIZE, roadLength * UNIT_SIZE, 3 * UNIT_SIZE);
                    r.setStrokeStyle(2, 0xffffff);
                    r.setFillStyle(0xffffff);
                }
                if (cell.hallways[2]) {
                    const r = this.add.rectangle(x * CELL_SIZE * UNIT_SIZE, y * CELL_SIZE * UNIT_SIZE + roadOffset * UNIT_SIZE, 2 * UNIT_SIZE, roadLength * UNIT_SIZE);
                    r.setStrokeStyle(2, 0xffffff);
                    r.setFillStyle(0xffffff);
                }
                if (cell.hallways[3]) {
                    const r = this.add.rectangle(x * CELL_SIZE * UNIT_SIZE - roadOffset * UNIT_SIZE, y * CELL_SIZE * UNIT_SIZE, roadLength * UNIT_SIZE, 3 * UNIT_SIZE);
                    r.setStrokeStyle(2, 0xffffff);
                    r.setFillStyle(0xffffff);
                }
            }
        }
    }

    update ()
    {
        this.player.update(this, this.cursorKeys);
    }
}