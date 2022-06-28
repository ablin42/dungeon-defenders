import { degToRad, getPublicAssetUrl, Vector2 } from "./utils";
import { UNIT_SCALE } from './Constants';

export class Weapon {
    BASE_ROT = 160;
    FLIP_BASE_ROT = 20;

    sprite!: Phaser.GameObjects.Image;
    physicsObj!: any;
    tween!: Phaser.Tweens.Tween;
    localPos: Vector2;
    origin: Vector2;
    player: Player;
    prevSpace = false;
    isAttacking = false;

    constructor(localPos: Vector2, origin: Vector2, player: Player) {
        this.localPos =  localPos.mul(UNIT_SCALE);
        this.origin = origin;
        this.player = player;
    }

    static preload(scene : Phaser.Scene) {
        scene.load.image('weapon', getPublicAssetUrl('GoldenLongSword.png'));
    }

    create(scene : Phaser.Scene, layer: Phaser.GameObjects.Layer) {
        this.sprite = scene.add.image(320, 320, 'weapon');
        this.sprite.setOrigin(this.origin.x, this.origin.y);
        this.sprite.scale = UNIT_SCALE;
        this.sprite.setRotation(degToRad(this.BASE_ROT));

        this.physicsObj = scene.add.circle(0, 0, 3).setScale(UNIT_SCALE);
        scene.physics.add.existing(this.physicsObj);

        this.tween = scene.tweens.addCounter({
            from: 0,
            to: 140,
            duration: 100,
            ease: 'Linear',
            onUpdate: (t) => {
                this.isAttacking = t.getValue() !== 140;                
                this.sprite.setRotation(degToRad(-90 + t.getValue() * (this.player.sprite.flipX ? -1 : 1)))
            }
        });
        this.tween.stop();

        layer.add(this.sprite);
    }

    update(scene : Phaser.Scene, cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (!this.isAttacking) {
            this.sprite.setRotation(this.player.sprite.flipX ? degToRad(this.FLIP_BASE_ROT) : degToRad(this.BASE_ROT));
        }
        this.sprite.x = this.player.sprite.x + this.localPos.x * (this.player.sprite.flipX ? -1 : 1);
        this.sprite.y = this.player.sprite.y + this.localPos.y;

        this.physicsObj.x = this.sprite.x + Math.cos(this.sprite.rotation) * 20 * UNIT_SCALE;
        this.physicsObj.y = this.sprite.y + Math.sin(this.sprite.rotation) * 20 * UNIT_SCALE;

        if (cursorKeys.space.isDown && !this.prevSpace && !this.isAttacking) {
            this.tween.restart();
        }
        this.prevSpace = cursorKeys.space.isDown;
    }
}

export class Player {
    sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    weapon: Weapon;
    speed: number;
    vx: number;
    vy: number;

    constructor() {
        this.weapon = new Weapon(new Vector2(0, 8), new Vector2(3 / 31, 6 / 12), this);
        this.speed = 150;
        this.vx = 0;
        this.vy = 0;
    }

    getSprite() { return this.sprite; }

    static preload(scene : Phaser.Scene) {
        scene.load.spritesheet('player', getPublicAssetUrl('RedKnight.png'), {frameWidth: 16, frameHeight: 28});
        Weapon.preload(scene);
    }

    create(scene : Phaser.Scene, layer: Phaser.GameObjects.Layer, x: number, y: number) {
        scene.anims.create({
            key: 'playerIdle',
            frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 1}),
            frameRate: 6,
            repeat: -1
        })
        scene.anims.create({
            key: 'playerWalking',
            frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 7}),
            frameRate: 8,
            repeat: -1
        })

        this.sprite = scene.physics.add.sprite(x, y, 'player', 0);
        this.sprite.scale = UNIT_SCALE;
        this.sprite.setSize(10, 17).setOffset(3, 11);
        this.sprite.play('playerIdle');

        layer.add(this.sprite);

        scene.cameras.main.startFollow(this.sprite);

        this.weapon.create(scene, layer);
    }

    update(scene : Phaser.Scene, cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (cursorKeys.right.isDown) {
            this.vx =this.speed;
            this.sprite.setFlipX(false);
        } else if (cursorKeys.left.isDown) {
            this.vx = -this.speed;
            this.sprite.setFlipX(true);
        } else {
            this.vx = 0;
        }
        
        if (cursorKeys.down.isDown) {
            this.vy = this.speed;
        } else if (cursorKeys.up.isDown) {
            this.vy = -this.speed;
        } else {
            this.vy = 0;
        }

        this.sprite.setVelocity(this.vx, this.vy);

        if (this.vx !== 0 || this.vy !== 0) {
            this.sprite.play('playerWalking', true);
        } else {
            this.sprite.play('playerIdle', true);
        }

        this.weapon.update(scene, cursorKeys);
    }
}