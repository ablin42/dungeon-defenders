import orcWarriorImg from './assets/OrcWarrior.png';
import { UNIT_SCALE } from './Constants';

export class Enemy {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    speed: number;
    vx: number;
    vy: number;

    constructor() {
        this.speed = 150;
        this.vx = 0;
        this.vy = 0;
    }

    getSprite() { return this.sprite; }

    static preload(scene : Phaser.Scene) {
        scene.load.spritesheet('orcWarrior', orcWarriorImg, {frameWidth: 16, frameHeight: 20});
    }

    create(scene : Phaser.Scene, layer: Phaser.GameObjects.Layer) {
        scene.anims.create({
            key: 'orcWarriorIdle',
            frames: scene.anims.generateFrameNumbers('orcWarrior', { start: 0, end: 3}),
            frameRate: 6,
            repeat: -1
        })
        scene.anims.create({
            key: 'orcWarriorWalking',
            frames: scene.anims.generateFrameNumbers('orcWarrior', { start: 4, end: 7}),
            frameRate: 8,
            repeat: -1
        })

        this.sprite = scene.physics.add.sprite(150, 320, 'orcWarrior', 0);
        this.sprite.scale = UNIT_SCALE;
        this.sprite.setSize(10, 16).setOffset(4, 4);
        this.sprite.play('orcWarriorIdle');

        layer.add(this.sprite);
    }

    update(scene : Phaser.Scene, cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.sprite.setVelocity(this.vx, this.vy);

        if (this.vx !== 0 || this.vy !== 0) {
            this.sprite.play('orcWarriorWalking', true);
        } else {
            this.sprite.play('orcWarriorIdle', true);
        }
    }
}