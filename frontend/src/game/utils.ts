export function getPublicAssetUrl(name: string) {
    return process.env.PUBLIC_URL + 'assets/game/' + name;
}

export function degToRad(deg: number) {
    return deg * Math.PI / 180;
}

export function fill2DArray(size: number, fill: () => any) {
    return Array.from({length: size}, () =>
    Array.from({length: size}, fill));
}

export class Vector2 {
    static zero = new Vector2(0, 0);

    x: number;
    y: number;
    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    mul(x?: number, y?: number) {
        if (y) {
            this.y *= y;
        }
        if (x) {
            this.x *= x;
            if (!y) {
                this.y *= x;
            }
        }

        return this;
    }
    
    magnitudeSqrd() {
        return this.x * this.x + this.y * this.y;
    }

    add(delta: Vector2) {
        this.x += delta.x;
        this.y += delta.y;
        return this;
    }
}

export class Line {
    p1: Vector2;
    p2: Vector2;

    constructor(p1: Vector2, p2: Vector2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    collide(line: Line): boolean {
        // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
        const d = ((this.p1.x - this.p2.x)*(line.p1.y - line.p2.y) - (this.p1.y - this.p2.y)*(line.p1.x - line.p2.x));
        const u1 = ((this.p1.x - line.p1.x)*(line.p1.y - line.p2.y) - (this.p1.y - line.p1.y)*(line.p1.x - line.p2.x)) / d;
        const u2 = ((this.p1.x - line.p1.x)*(this.p1.y - this.p2.y) - (this.p1.y - line.p1.y)*(this.p1.x - this.p2.x)) / d;
        
        return u1 > 0 && u1 < 1 && u2 > 0 && u2 < 1;
    }

    transform(delta: Vector2) {
        this.p1.add(delta);
        this.p2.add(delta);
    }
}

export class Rectangle {
    tl!: Vector2;
    tr!: Vector2;
    br!: Vector2;
    bl!: Vector2;

    c!: Vector2;

    top!: Line;
    right!: Line;
    bottom!: Line;
    left!: Line;

    width!: number;
    height!: number;

    constructor(tl: Vector2, width: number, height: number) {
        this._init(tl, width, height);
    }

    _init(tl: Vector2, width: number, height: number) {
        this.width = width;
        this.height = height;

        this.tl = tl;
        this.br = new Vector2(tl.x + width, tl.y - height);

        this.tr = new Vector2(this.br.x, tl.y);
        this.bl = new Vector2(tl.x, this.br.y);

        this.top = new Line(this.tl, this.tr);
        this.right = new Line(this.tr, this.br);
        this.bottom = new Line(this.bl, this.br);
        this.left = new Line(this.tl, this.bl);
        
        this.c = new Vector2(this.tl.x + this.width / 2, this.tl.y - this.height / 2);
    }

    collide(line: Line): boolean {
        return line.collide(this.top) ||
                line.collide(this.right) ||
                line.collide(this.bottom) ||
                line.collide(this.left);
    }

    overlap(rect: Rectangle): boolean {
        // If one rectangle is on the left side of the other
        if (this.tl.x >= rect.tr.x || rect.tl.x >= this.tr.x) {
            return false;
        }

        // If one rectangle is on top of side of the other
        if (this.bl.y >= rect.tl.y || rect.bl.y >= this.tl.y) {
            return false;
        }

        return true;
    }
    
    transform(delta: Vector2) {
        this._init(this.tl.add(delta), this.width, this.height);
    }
}
