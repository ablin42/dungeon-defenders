import { HALF_UNIT_SIZE, UNIT_SCALE } from "./Constants";
import { getPublicAssetUrl } from "./utils";

export interface CreateTileOptions {
    layer?: Phaser.GameObjects.Layer,
    animate?: boolean,
    addCollision?: boolean,
    physicsGroup?: Phaser.Physics.Arcade.StaticGroup
}

export function loadTiles(scene: Phaser.Scene) {
    scene.load.spritesheet('tiles', getPublicAssetUrl('Tiles.png'), { frameWidth: 16, frameHeight: 16 });
}

export function createTile(scene: Phaser.Scene, x: number, y: number, tile = 29, optons?: CreateTileOptions) {
    const spawnX = x + (optons?.animate ? -HALF_UNIT_SIZE : 0);
    const spawnY = y + (optons?.animate ? -HALF_UNIT_SIZE : 0);
    const tileSprite = scene.add.sprite(spawnX, spawnY, 'tiles', tile);
    optons?.layer?.add(tileSprite);
    tileSprite.scale = UNIT_SCALE;
    if (optons?.animate) {
        tileSprite.alpha = 0;
        scene.tweens.add({
            targets: tileSprite,
            x: {value: x, duration: 200},
            y: {value: y, duration: 200},
            alpha: {value: 1, duration: 150},
        })
    }

    if (optons?.physicsGroup) {
        if (optons?.addCollision) {
            optons.physicsGroup.create(x, y, 'tiles', 0, false).setScale(UNIT_SCALE).refreshBody();
        } else {
            scene.physics.add.existing(tileSprite);
            optons.physicsGroup.add(tileSprite);
        }
    }
}