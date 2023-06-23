
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



export class Actor {
    row: number;
    col: number;

    piece: Grid;

    // 0, 1, 2, 3 for each 90deg orientation going clockwise
    angle: number;

    constructor(piece: Grid) {

    }

    setAngle(angle: number) {
        this.angle = angle % 4;
    }

    didCollide(grid: Grid) {

    }
}