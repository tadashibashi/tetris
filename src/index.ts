import '../styles/styles.scss';
import * as Audio from "./WebAA";
import { Grid } from "./Grid";
import { Pieces } from "./Pieces"
import {Actor} from "./Actor";

const audio = new Audio.AudioEngine;
let tetrisEl: HTMLElement;
let gridEl: HTMLElement;
let pointsEl: HTMLElement;

const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;

let grid = new Grid(FIELD_HEIGHT, FIELD_WIDTH);
const player = new Actor(grid);
let score: number = 0;

let stepSpeed = 33.333; // each step takes this amt of ms
let isRunning = true;

function getPosFromId(id: string) {
    const matches = id.match(/(?<=[rc])\d+/g);
    return {
        row: (matches) ? parseInt(matches[0]) : -1,
        col: (matches) ? parseInt(matches[1]) : -1,
    }
}

window.onload = () => {
    tetrisEl = document.getElementById("tetris");
    gridEl = document.getElementById("grid");
    pointsEl = document.getElementById("points");

    for (let row = 0; row < FIELD_HEIGHT; ++row) {
        for (let col = 0; col < FIELD_WIDTH; ++col) {

            const newDiv = document.createElement("div");
            newDiv.id = "r" + row + "c" + col;
            gridEl.appendChild(newDiv);
        }
    }

    // Test draw blocks
    gridEl.addEventListener("click", evt => {
        const target = evt.target as HTMLElement;

        const pos = getPosFromId(target.id);
        if (pos.row !== -1)
            grid.set(pos.row, pos.col, 2);
    });

    document.addEventListener("keydown", evt => {

        // TODO: Actor.move function to check for collisions
        if (evt.code === "ArrowLeft") {
            player.col -= 1;
        }
        if (evt.code === "ArrowRight") {
            player.col += 1;
        }
        if (evt.code === "ArrowDown") {
            player.row += 1;
            player.counter = player.speed;
        }

        if (evt.repeat) {

        } else {
            if (evt.code === "KeyX") {
                ++player.angle;
                player.angle %= 4;
            }
            if (evt.code === "KeyZ") {
                --player.angle;
                if (player.angle < 0)
                    player.angle += 4;
            }




        }

    });


    // first render
    render();
    update();

    function update() {

        // for (let row = 0; row < FIELD_HEIGHT; ++row) {
        //     for (let col = 0; col < FIELD_WIDTH; ++col) {
        //         grid.set(row, col, Math.floor(Math.random() * 8));
        //     }
        // }

        player.update(stepSpeed);

        render();
        if (isRunning)
            setTimeout(update, stepSpeed);
    }

    function render() {
        pointsEl.innerText = score.toString();
        const tiles = gridEl.children as HTMLCollectionOf<HTMLElement>;

        for (let row = 0; row < FIELD_HEIGHT; ++row) {
            for (let col = 0; col < FIELD_WIDTH; ++col) {
                const idx = row * FIELD_WIDTH + col;
                tiles[idx].style.background = Pieces[grid.get(row, col)].color;
            }
        }

        player.render(tiles);
    }
};