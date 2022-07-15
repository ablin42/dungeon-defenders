import { UNIT_SCALE } from './Constants';
import { ENEMIES } from './GameAssets';
import { Vector2 } from './utils';

export class Enemy {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    speed: number;
    velocity: Vector2;
    knockbackVelocity: Vector2;
    knockbackForce: number;
    knockbackDeceleration: number;

    health = 3;
    isDead = false;

    constructor() {
        this.speed = 150;
        this.velocity = new Vector2(0, 0);
        this.knockbackVelocity = new Vector2(0, 0);
        this.knockbackForce = this.speed * 10;
        this.knockbackDeceleration = this.speed * 2.5;
    }

    getSprite() { return this.sprite; }

    static create(scene: Phaser.Scene) {
        const gameAsset = ENEMIES[0];
        scene.anims.create({
            key: 'orcWarriorIdle',
            frames: scene.anims.generateFrameNumbers(gameAsset.key, { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        })
        scene.anims.create({
            key: 'orcWarriorWalking',
            frames: scene.anims.generateFrameNumbers(gameAsset.key, { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1
        })
    }

    create(scene: Phaser.Scene, layer: Phaser.GameObjects.Layer, pos: Vector2) {
        const gameAsset = ENEMIES[0];

        this.sprite = scene.physics.add.sprite(pos.x, pos.y, gameAsset.key, 0);
        this.sprite.scale = UNIT_SCALE;
        this.sprite.setSize(gameAsset.colliderSize.x, gameAsset.colliderSize.y).setOffset(gameAsset.colliderOffset.x, gameAsset.colliderOffset.y);
        this.sprite.play('orcWarriorIdle');

        layer.add(this.sprite);
    }

    onHit(collisionPoint: Vector2) {
        if (this.isDead) {
            return;
        }

        const collisionVector = new Vector2(this.sprite.x, this.sprite.y).sub(collisionPoint);
        this.knockbackVelocity = collisionVector.normalized().mul(this.knockbackForce);
        this.health--;
        if (this.health <= 0) {
            this.sprite.destroy()
            this.isDead = true;
        }
    }

    update(scene: Phaser.Scene) {
        if (this.isDead) {
            return;
        }

        const trueVelocity = Vector2.add(this.velocity, this.knockbackVelocity);
        this.sprite.setVelocity(trueVelocity.x, trueVelocity.y);

        if (trueVelocity.x !== 0 || trueVelocity.y !== 0) {
            this.sprite.play('orcWarriorWalking', true);
        } else {
            this.sprite.play('orcWarriorIdle', true);
        }

        if (this.knockbackVelocity.magnitudeSqrd() > 0) {
            this.knockbackVelocity.add(this.knockbackVelocity.normalized().mul(-this.knockbackDeceleration));
            if (this.knockbackVelocity.magnitude() < this.knockbackDeceleration) {
                this.knockbackVelocity = new Vector2(0, 0);
            }
        }
    }
}