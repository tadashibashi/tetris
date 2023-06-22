
/*
Line = [
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0
];

L: [
    0, 0
]
 */


import {Grid} from "./Grid";

// 4x4 Tetronimo
export class Piece extends Grid {

    // produces a rotated piece where angle rotated = angle * 90
    createRotated(angle: number): Piece {
        const rotated = new Piece;

        return rotated;
    }

    constructor(grid?: Uint8Array) {
        super(4, 4, grid);
    }
}

export class PieceActor {
    row: number;
    col: number;

    piece: Grid;

    // 0, 1, 2, 3 for each 90deg orientation going clockwise
    angle: number;

    constructor(piece: Piece) {

    }

    setAngle(angle: number) {
        this.angle = angle % 4;
    }

    didCollide(grid: Grid) {

    }
}