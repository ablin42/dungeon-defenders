import { fill2DArray, Vector2 } from "./utils";

export const DIR_UP = 0;
export const DIR_RIGHT = 1;
export const DIR_DOWN = 2;
export const DIR_LEFT = 3;

export enum RoomType {
    NONE,
    SPAWN_ROOM,
    ENEMY_ROOM,
    BOSS_ROOM,
}

export interface CellDetails {
    roomType: RoomType,
    hallways: boolean[]
}

const CONNECT_TO_NEIGHBOR_CHANCES = 0.15;

function fillDungeon(map: CellDetails[][], spawnCoord: number, numOfRooms: number) {
    if (numOfRooms < 2) {
        throw 'need at least 2 rooms';
    }

    const isValidCoord = (pos: Vector2) => {
        return pos.y >= 0 && pos.y < map.length &&
            pos.x >= 0 && pos.x < map[0].length;
    }

    const isEmpty = (pos: Vector2) => {
        return map[pos.y][pos.x].roomType === RoomType.NONE;
    }

    const getOppositeDir = (dir: number) => {
        return (dir + 2) % 4;
    }

    const options: [Vector2, Vector2, number][] = [];

    // Spawn Room
    numOfRooms--;
    const spawnPoint = new Vector2(spawnCoord, spawnCoord);
    map[spawnPoint.y][spawnPoint.x].roomType = RoomType.SPAWN_ROOM;
    options.push([new Vector2(spawnCoord - 1, spawnCoord), spawnPoint, DIR_LEFT]);
    options.push([new Vector2(spawnCoord + 1, spawnCoord), spawnPoint, DIR_RIGHT]);
    options.push([new Vector2(spawnCoord, spawnCoord - 1), spawnPoint, DIR_UP]);
    options.push([new Vector2(spawnCoord, spawnCoord + 1), spawnPoint, DIR_DOWN]);

    while (options.length > 0 && numOfRooms > 0) {
        const option = options.splice(0, 1)[0];
        const pos = option[0];
        if (!isValidCoord(pos) || !isEmpty(pos)) {
            continue;
        }
        const prevPos = option[1];
        const prevDir = option[2];

        const chances = 1 / options.length;
        let roll = Math.random();
        if (roll < chances) {
            numOfRooms--;
            map[pos.y][pos.x].roomType = numOfRooms === 0 ? RoomType.BOSS_ROOM : RoomType.ENEMY_ROOM;
            const oppositeDir = getOppositeDir(prevDir);
            map[pos.y][pos.x].hallways[oppositeDir] = map[prevPos.y][prevPos.x].hallways[prevDir] = true;
            
            if (numOfRooms === 0) {
                break;
            }

            const left = new Vector2(pos.x - 1, pos.y);
            const right = new Vector2(pos.x + 1, pos.y);
            const up = new Vector2(pos.x, pos.y - 1);
            const down = new Vector2(pos.x, pos.y + 1);

            if (oppositeDir !== DIR_LEFT && isValidCoord(left)) {
                if (isEmpty(left)) {
                    options.unshift([left, pos, DIR_LEFT]);
                } else if (map[left.y][left.x].roomType !== RoomType.BOSS_ROOM) {
                    roll = Math.random();
                    if (roll < CONNECT_TO_NEIGHBOR_CHANCES) {
                        map[pos.y][pos.x].hallways[DIR_LEFT] = true;
                        map[left.y][left.x].hallways[DIR_RIGHT] = true;
                    }
                }
            }
            if (oppositeDir !== DIR_RIGHT && isValidCoord(right)) {
                if (isEmpty(right)) {
                    options.unshift([right, pos, DIR_RIGHT]);
                } else if (map[right.y][right.x].roomType !== RoomType.BOSS_ROOM) {
                    roll = Math.random();
                    if (roll < CONNECT_TO_NEIGHBOR_CHANCES) {
                        map[pos.y][pos.x].hallways[DIR_RIGHT] = true;
                        map[right.y][right.x].hallways[DIR_LEFT] = true;
                    }
                }
            }
            if (oppositeDir !== DIR_UP && isValidCoord(up)) {
                if (isEmpty(up)) {
                    options.unshift([up, pos, DIR_UP]);
                } else if (map[up.y][up.x].roomType !== RoomType.BOSS_ROOM) {
                    roll = Math.random();
                    if (roll < CONNECT_TO_NEIGHBOR_CHANCES) {
                        map[pos.y][pos.x].hallways[DIR_UP] = true;
                        map[up.y][up.x].hallways[DIR_DOWN] = true;
                    }
                }
            }
            if (oppositeDir !== DIR_DOWN && isValidCoord(down)) {
                if (isEmpty(down)) {
                    options.unshift([down, pos, DIR_DOWN]);
                } else if (map[down.y][down.x].roomType !== RoomType.BOSS_ROOM) {
                    roll = Math.random();
                    if (roll < CONNECT_TO_NEIGHBOR_CHANCES) {
                        map[pos.y][pos.x].hallways[DIR_DOWN] = true;
                        map[down.y][down.x].hallways[DIR_UP] = true;
                    }
                }
            }
        }
    }
}

export function simpleDungeonGenerator(dungeonSize: number, numOfRooms: number) {
    const map: CellDetails[][] = fill2DArray(dungeonSize, ()=> {return {roomType: RoomType.NONE, hallways: [false, false, false, false]}});

    fillDungeon(map, Math.floor(dungeonSize / 2), numOfRooms);

    return map;
}

function printOutput(map: CellDetails[][]) {
    let output: string[] = [];
    map.forEach((row, idx) => {
        const rows = ['    ', `${idx.toString().padStart(3, '0')}) `, '    '];
        row.forEach(col => {
            console.log(col);
            rows[0] += `.${col.hallways[DIR_UP] ? '|' : '.'}.`
            rows[1] += `${col.hallways[DIR_LEFT] ? '-' : '.'}`
            rows[2] += `.${col.hallways[DIR_DOWN] ? '|' : '.'}.`
            let r = '.'
            switch (col.roomType) {
                case RoomType.SPAWN_ROOM:
                    r = 'S';
                    break;
                case RoomType.BOSS_ROOM:
                    r = 'B';
                    break;
                case RoomType.ENEMY_ROOM:
                    r = 'E';
                    break;

            }
            rows[1] += `${r}${col.hallways[DIR_LEFT] ? '-' : '.'}`
        })
        output = output.concat(rows);
    })
    output.forEach(r => console.log(r))
}