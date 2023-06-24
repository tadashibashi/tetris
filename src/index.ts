import '../styles/styles.scss'; // include scss in build

import * as Audio from "./WebAA";

import {Actor} from "./Actor";
import {getRandPiece, PieceData, PiecesCount} from "./PieceData"
import {TetrisGrid} from "./TetrisGrid";
import {Grid} from "./Grid";

const audio = new Audio.AudioEngine;
let tetrisEl: HTMLElement;
let gridEl: HTMLElement;
let pointsEl: HTMLElement;
let levelEl: HTMLElement;
let nextUpGridEl: HTMLElement;

const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;

let grid = new TetrisGrid(FIELD_HEIGHT, FIELD_WIDTH);

let score = 0;
let level = 1;

let stepSpeed = 33.333; // each step takes this amt of ms
let isRunning = true;

let nextPiece: Grid = getRandPiece();
let storedPiece: Grid = null;

function getPosFromId(id: string) {
    const matches = id.match(/(?<=[rc])\d+/g);
    return {
        row: (matches) ? parseInt(matches[0]) : -1,
        col: (matches) ? parseInt(matches[1]) : -1,
    }
}

const player = new Actor(grid, () => getNextPiece());
function getNextPiece(): Grid {
    const sendThis = nextPiece;

    nextPiece = getRandPiece();
    return sendThis;
}


window.onload = () => {
    tetrisEl = document.getElementById("tetris");
    gridEl = document.getElementById("grid");
    pointsEl = document.getElementById("points");
    levelEl = document.getElementById("level");
    nextUpGridEl = document.getElementById("next-up-grid");

    player.onPieceConnect.addListener(actor => {
       const tiles = actor.getTileEls();
       console.log(tiles);
       tiles.forEach(tile => {
           tile.classList.remove("small-grow");
           tile.classList.add("small-grow");
       });
    });

    player.onLineClear.addListener(lines => {
        if (lines.length === 4) {
            score += 800 * level;
        } else if (lines.length === 3) {
            score += 400 * level;
        } else if (lines.length === 2) {
            score += 200 * level;
        } else if (lines.length === 1) {
            score += 100 * level;
        }
    });

    tetrisEl.addEventListener("animationend", evt => {
        const target = evt.target as HTMLElement;

        if (evt.animationName === "small-grow" || evt.animationName === "row-clear")
            target.classList.remove(evt.animationName);
    });

    for (let row = 0; row < FIELD_HEIGHT; ++row) {
        for (let col = 0; col < FIELD_WIDTH; ++col) {

            const newDiv = document.createElement("div");
            newDiv.id = "r" + row + "c" + col;
            newDiv.style.zIndex = "" + row;
            gridEl.appendChild(newDiv);
        }
    }

    for (let row = 0; row < 4; ++row) {
        nextUpGridEl.appendChild(document.createElement("div"));
    }

    // Test draw blocks
    gridEl.addEventListener("click", evt => {
        const target = evt.target as HTMLElement;

        const pos = getPosFromId(target.id);
        if (pos.row !== -1)
            grid.set(pos.row, pos.col, 2);
    });

    document.addEventListener("keydown", evt => {
        evt.preventDefault(); // prevent browser from using keydowns for shortcuts

        switch (evt.code) {
            case "ArrowLeft":
                player.move(0, -1);
                break;
            case "ArrowRight":
                player.move(0, 1);
                break;
            case "ArrowDown":
                if (player.moveDownOne())
                    ++score;
                player.resetCounter();

                break;
            case "ArrowUp":
                break;
        }

        if (evt.repeat) {

        } else {
            if (evt.code === "KeyX") {
                player.rotate(player.angle + 1);
            }
            if (evt.code === "KeyZ") {
                player.rotate(player.angle - 1);
            }
            if (evt.code === "ArrowUp") {
                player.immediateDrop();
            }




        }

    });

    grid.onAnimEnd.addListener(animName => {
        if (animName === "line-clear") {
            render();
        }
    });


    // first render
    render();
    update();

    function update() {
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
                const gridVal = grid.get(row, col);
                tiles[idx].style.background = gridVal === PiecesCount + 1 ? "rgba(0, 0, 0, 0.75)" : PieceData[gridVal].color;
                tiles[idx].style.boxShadow = "";
                tiles[idx].style.zIndex = "1";
            }
        }

        player.render(tiles);
    }
};