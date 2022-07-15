import { getPublicAssetUrl, Vector2 } from "./utils";

export type GameAsset = {
    key: string,
    frameSize: Vector2,
    center: Vector2,
    colliderOffset: Vector2,
    colliderSize: Vector2,
    isCharacter: boolean
}

const KNIGHT_RED: GameAsset = {
    key: 'RedKnight',
    frameSize: new Vector2(16, 28),
    center: Vector2.zero,
    colliderOffset: new Vector2(3, 11),
    colliderSize: new Vector2(10, 17),
    isCharacter: true
};

const KNIGHT_ORANGE: GameAsset = {
    key: 'OrangeKnight',
    frameSize: new Vector2(16, 28),
    center: Vector2.zero,
    colliderOffset: new Vector2(3, 11),
    colliderSize: new Vector2(10, 17),
    isCharacter: true
};

const ELF_MAN: GameAsset = {
    key: 'ElfMan',
    frameSize: new Vector2(16, 28),
    center: Vector2.zero,
    colliderOffset: new Vector2(3, 11),
    colliderSize: new Vector2(10, 17),
    isCharacter: true
};

const ELF_WOMAN: GameAsset = {
    key: 'ElfWoman',
    frameSize: new Vector2(16, 28),
    center: Vector2.zero,
    colliderOffset: new Vector2(3, 13),
    colliderSize: new Vector2(9, 15),
    isCharacter: true
};

const DINO_GREEN: GameAsset = {
    key: 'GreenDino',
    frameSize: new Vector2(16, 28),
    center: Vector2.zero,
    colliderOffset: new Vector2(3, 13),
    colliderSize: new Vector2(9, 15),
    isCharacter: true
};

const DINO_BLUE: GameAsset = {
    key: 'BlueDino',
    frameSize: new Vector2(16, 28),
    center: Vector2.zero,
    colliderOffset: new Vector2(3, 13),
    colliderSize: new Vector2(9, 15),
    isCharacter: true
};

export const CHARACTERS: GameAsset[] = [ELF_MAN, ELF_WOMAN, KNIGHT_RED, KNIGHT_ORANGE, DINO_BLUE, DINO_GREEN];

const ORC_WARRIOR: GameAsset = {
    key: 'OrcWarrior',
    frameSize: new Vector2(16, 20),
    center: Vector2.zero,
    colliderOffset: new Vector2(4, 4),
    colliderSize: new Vector2(10, 16),
    isCharacter: true
};

export const ENEMIES: GameAsset[] = [ORC_WARRIOR];

const RUSTY_SWORD: GameAsset = {
    key: 'weapon_rusty_sword',
    frameSize: new Vector2(21, 10),
    center: new Vector2(3, 5),
    colliderOffset: new Vector2(18, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const SAW_SWORD: GameAsset = {
    key: 'weapon_saw_sword',
    frameSize: new Vector2(21, 10),
    center: new Vector2(3, 5),
    colliderOffset: new Vector2(18, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const ANIME_SWORD: GameAsset = {
    key: 'weapon_anime_sword',
    frameSize: new Vector2(30, 12),
    center: new Vector2(6, 5),
    colliderOffset: new Vector2(25, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const DUEL_SWORD: GameAsset = {
    key: 'weapon_duel_sword',
    frameSize: new Vector2(30, 9),
    center: new Vector2(5, 3),
    colliderOffset: new Vector2(25, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const AXE: GameAsset = {
    key: 'weapon_axe',
    frameSize: new Vector2(21, 9),
    center: new Vector2(4, 2),
    colliderOffset: new Vector2(16, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const KATANA: GameAsset = {
    key: 'weapon_katana',
    frameSize: new Vector2(29, 6),
    center: new Vector2(6, 3),
    colliderOffset: new Vector2(25, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const BATON_WITH_SPIKES: GameAsset = {
    key: 'weapon_baton_with_spikes',
    frameSize: new Vector2(22, 10),
    center: new Vector2(5, 5),
    colliderOffset: new Vector2(18, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const CLEAVER: GameAsset = {
    key: 'weapon_cleaver',
    frameSize: new Vector2(19, 8),
    center: new Vector2(4, 1),
    colliderOffset: new Vector2(15, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const HAMMER: GameAsset = {
    key: 'weapon_hammer',
    frameSize: new Vector2(24, 10),
    center: new Vector2(4, 4),
    colliderOffset: new Vector2(19, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const MACE: GameAsset = {
    key: 'weapon_mace',
    frameSize: new Vector2(24, 10),
    center: new Vector2(4, 4),
    colliderOffset: new Vector2(19, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const GOLDEN_SWORD: GameAsset = {
    key: 'weapon_golden_sword',
    frameSize: new Vector2(22, 10),
    center: new Vector2(5, 5),
    colliderOffset: new Vector2(19, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const KNIGHT_SWORD: GameAsset = {
    key: 'weapon_knight_sword',
    frameSize: new Vector2(29, 10),
    center: new Vector2(6, 4),
    colliderOffset: new Vector2(24, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};
const LAVISH_SWORD: GameAsset = {
    key: 'weapon_lavish_sword',
    frameSize: new Vector2(30, 10),
    center: new Vector2(7, 4),
    colliderOffset: new Vector2(25, 0),
    colliderSize: Vector2.zero,
    isCharacter: false
};

export const WEAPONS: GameAsset[] = [RUSTY_SWORD, HAMMER, DUEL_SWORD, KATANA, SAW_SWORD, AXE, CLEAVER, MACE, BATON_WITH_SPIKES, KNIGHT_SWORD, ANIME_SWORD, GOLDEN_SWORD, LAVISH_SWORD];

export function loadAssets(scene: Phaser.Scene) {
    CHARACTERS.forEach(x => scene.load.spritesheet(x.key, getPublicAssetUrl(`characters/${x.key}.png`), { frameWidth: x.frameSize.x, frameHeight: x.frameSize.y }));
    ENEMIES.forEach(x => scene.load.spritesheet(x.key, getPublicAssetUrl(`enemies/${x.key}.png`), { frameWidth: x.frameSize.x, frameHeight: x.frameSize.y }));
    WEAPONS.forEach(x => scene.load.spritesheet(x.key, getPublicAssetUrl(`weapon/${x.key}.png`), { frameWidth: x.frameSize.x, frameHeight: x.frameSize.y }));
}