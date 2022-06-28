import { UNIT_SCALE } from './Constants';
import { getPublicAssetUrl } from './utils';

export class TreasureChest {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    onComplete!: () => void;

    isOpen = false;

    getSprite() { return this.sprite; }

    static preload(scene : Phaser.Scene) {
        scene.load.spritesheet('treasureChest', getPublicAssetUrl('TreasureChest.png'), {frameWidth: 16, frameHeight: 16});
    }

    create(scene : Phaser.Scene, layer: Phaser.GameObjects.Layer, x: number, y: number, onComplete: () => void) {
        this.onComplete = onComplete;

        scene.anims.create({
            key: 'treasureChestOpen',
            frames: scene.anims.generateFrameNumbers('treasureChest', { start: 0, end: 2}),
            frameRate: 6,
        })

        this.sprite = scene.physics.add.sprite(x, y, 'treasureChest', 0);
        this.sprite.scale = UNIT_SCALE;

        this.sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'treasureChestOpen', this.onComplete)

        layer.add(this.sprite);
    }

    open() {
        if (this.isOpen) {
            return;
        }

        this.isOpen = true;
        this.sprite.play('treasureChestOpen');
    }
}