import { EAST, NORTH, SOUTH, WEST } from './constants.mjs';
import { times, randomFromArray, randomFromArrayWeighted } from './misc.mjs';

export class Stack {
    constructor() {
        this._items = [];
    }

    isEmpty() {
        return this._items.length === 0;
    }

    push(item) {
        this._items.push(item);
    }

    pop() {
        if (this.isEmpty()) throw new Error('popping empty stack!');
        return this._items.pop();
    }
}

export class Tile {
    static variants = [];
    static weights = [];

    constructor() {
        this.possibilities = times(Tile.variants.length);
        this.neighbors = new Map();
    }

    get entropy() {
        return this.possibilities.length - 1;
    }

    get directions() {
        return Array.from(this.neighbors.keys());
    }

    addNeighbor(direction, tile) {
        this.neighbors.set(direction, tile);
    }

    getNeighbor(direction) {
        return this.neighbors.get(direction);
    }

    collapse() {
        const weights = this.possibilities.map((i) => Tile.weights[i]);
        this.possibilities = [ randomFromArrayWeighted(this.possibilities, weights) ];
    }

    constrain(neighborPossibilities, direction) {
        let reduced = false;

        if (this.entropy > 0) {
            const connectors = new Set();
            for (const np of neighborPossibilities) {
                connectors.add(Tile.variants[np].rules[direction]);
            }

            let opposite;
            if      (direction === NORTH) opposite = SOUTH;
            else if (direction === EAST)  opposite = WEST;
            else if (direction === SOUTH) opposite = NORTH;
            else                          opposite = EAST;

            const possibilitiesCopy = Array.from(this.possibilities);
            for (const possibility of possibilitiesCopy) {
                if (!connectors.has(Tile.variants[possibility].rules[opposite])) {
                    const idx = this.possibilities.indexOf(possibility);
                    this.possibilities.splice(idx, 1);
                    reduced = true;
                }
            }
        }

        return reduced;
    }
}

export class World {
    constructor([cols, rows]) {
        this._dims = [cols, rows];
        this._tileRows = [];

        for (let _ of times(rows)) {
            let tileRow = [];
            for (let __ of times(cols)) {
                const tile = new Tile();
                tileRow.push(tile);
            }
            this._tileRows.push(tileRow);
        }

        for (const [x, y] of this.getPositions()) {
            const tile = this.getTile([x, y]);
            if (x > 0)        tile.addNeighbor(WEST,  this.getTile([x-1, y]));
            if (x < cols - 1) tile.addNeighbor(EAST,  this.getTile([x+1, y]));
            if (y > 0)        tile.addNeighbor(NORTH, this.getTile([x, y-1]));
            if (y < rows - 1) tile.addNeighbor(SOUTH, this.getTile([x, y+1]));
        }
    }

    getTile([x, y]) {
        try {
            return this._tileRows[y][x];
        } catch (_) {
            throw new Error(`Can't get tile [${x}, ${y}]!`);
        }
    }

    getPositions() {
        const positions = [];
        for (let y of times(this._dims[1])) {
            for (let x of times(this._dims[0])) {
                positions.push([x, y]);
            }
        }
        return positions;
    }

    getTiles() {
        const tiles = [];
        for (const [x, y] of this.getPositions()) {
            tiles.push( this.getTile([x, y]) );
        }
        return tiles;
    }

    getLowestEntropy() {
        let lowestEntropy = Number.MAX_SAFE_INTEGER;
        for (const tile of this.getTiles()) {
            const tileEntropy = tile.entropy;
            if (tileEntropy > 0 && tileEntropy < lowestEntropy) {
                lowestEntropy = tileEntropy;
            }
        }
        return lowestEntropy;
    }

    getTilesWithLowestEntropy() {
        const lowestEntropy = this.getLowestEntropy();
        return this.getTiles().filter((tile) => {
            return tile.entropy === lowestEntropy;
        });
    }

    waveFunctionCollapse() {
        const lowestTiles = this.getTilesWithLowestEntropy();
        if (lowestTiles.length === 0) return false;

        const tileToCollapse = randomFromArray(lowestTiles);
        tileToCollapse.collapse();

        const stack = new Stack();
        stack.push(tileToCollapse);

        while (!stack.isEmpty()) {
            const tile = stack.pop();
            const tilePossibilities = tile.possibilities;
            const directions = tile.directions;

            for (let direction of directions) {
                const neighbor = tile.getNeighbor(direction);
                if (neighbor.entropy > 0) {
                    let reduced = neighbor.constrain(tilePossibilities, direction);
                    if (reduced) stack.push(neighbor);
                }
            }
        }

        return true;
    }
}

export class DrawWorld {
    constructor([w, h], canvas, sprites, spriteScale, [dx, dy], fonts) {
        this._dims = [w, h];
        this.canvas = canvas;
        this.sprites = sprites;
        this.spriteScale = spriteScale;
        this.deltas = [dx, dy];
        this.fonts = fonts;
        this.world = new World(this._dims);
    }

    getPositions() {
        const positions = [];
        for (let y of times(this._dims[1])) {
            for (let x of times(this._dims[0])) {
                positions.push([x, y]);
            }
        }
        return positions;
    }

    update() {
        const lowestEntropy = this.world.getLowestEntropy();
        const [dx, dy] = this.deltas;
        for (const [x, y] of this.getPositions()) {
            const tile = this.world.getTile([x, y]);
            const tileEntropy = tile.entropy;
            const px = dx * x;
            const py = dy * y;
            const pxc = px + dx/2;
            const pyc = py + dy/2;

            if (tileEntropy > 0) {
                this.canvas.rect([px, py], [dx, dy]);
                let font, color;
                if (tileEntropy >= 10) {
                    font = this.fonts[1];
                    color = 'gray';
                } else {
                    font = this.fonts[2];
                    color = 'white';
                }
                if (tileEntropy === lowestEntropy) color = 'green';
                this.canvas.text(font, [pxc, pyc], `${tileEntropy}`, color)
            } else {
                const spr = this.sprites[ tile.possibilities[0] ];
                this.canvas.drawScaled(spr, [px, py], this.spriteScale);
            }
        }
    }
}
