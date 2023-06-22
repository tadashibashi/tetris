import * as Audio from "WebAA";
import { Grid } from "./Grid";

const audio = new Audio.AudioEngine;
let tetrisEl: HTMLElement;
let gridEl: HTMLElement;
let pointsEl: HTMLElement;

const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;

type PieceInfo = {color: string, id: number};
interface PieceDatabase {
    [key: string]: PieceInfo,
    None: PieceInfo,
    Stick: PieceInfo,
    L: PieceInfo,
    RevL: PieceInfo,
    StepR: PieceInfo,
    StepL: PieceInfo,
    FourProng: PieceInfo,
    Box: PieceInfo
}

const Pieces: PieceDatabase = {
    None: { color: "clear", id: 0 },
    Stick: {color: "skyblue", id: 1},
    L: {color: "orange", id: 2},
    RevL: {color: "blue", id: 3},
    StepR: {color: "red", id: 4},
    StepL: {color: "green", id: 5},
    FourProng: {color: "purple", id: 6},
    Box: {color: "gray", id: 7},
};

// Make Pieces accessible via id as well as name.
Object.keys(Pieces).forEach(key => {
    Pieces[Pieces[key].id] = Pieces[key];
});
Object.freeze(Pieces);
Object.seal(Pieces);

let grid = new Grid(FIELD_WIDTH, FIELD_HEIGHT);
let score: number = 0;

let stepSpeed = 37; // each step takes this amt of ms
let isRunning = true;

window.onload = () => {
    tetrisEl = document.getElementById("tetris");
    gridEl = document.getElementById("grid");
    pointsEl = document.getElementById("points");

    for (let row = 0; row < FIELD_HEIGHT; ++row) {
        for (let col = 0; col < FIELD_WIDTH; ++col) {
            grid.set(row, col, Math.floor(Math.random() * 8));

            const newDiv = document.createElement("div");
            newDiv.id = "r" + row + "c" + col;
            gridEl.appendChild(newDiv);
        }
    }



    // first render
    render();
    update();

    function update() {
        ++score;

        for (let row = 0; row < FIELD_HEIGHT; ++row) {
            for (let col = 0; col < FIELD_WIDTH; ++col) {
                grid.set(row, col, Math.floor(Math.random() * 8));
            }
        }

        render();
        if (isRunning)
            setTimeout(update, stepSpeed);
    }

    function render() {
        pointsEl.innerText = score.toString();
        const tiles = gridEl.children as HTMLCollectionOf<HTMLDivElement>;

        for (let row = 0; row < FIELD_HEIGHT; ++row) {
            for (let col = 0; col < FIELD_WIDTH; ++col) {
                const idx = row * FIELD_WIDTH + col;
                tiles[idx].style.background = Pieces[grid.get(row, col)].color;
            }
        }
    }
};