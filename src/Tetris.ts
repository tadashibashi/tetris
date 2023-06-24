import {Game} from "./Game";
import {Actor} from "./Actor";
import {TetrisGrid} from "./TetrisGrid";
import {Grid} from "./Grid";
import {getRandPiece, PieceData, PiecesCount} from "./PieceData";

let tetrisEl: HTMLElement;
let gridEl: HTMLElement;
let pointsEl: HTMLElement;
let levelEl: HTMLElement;
let nextUpGridEl: HTMLElement;
let heldGridEl: HTMLElement;

const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;

export class Tetris extends Game {

    constructor() {
        super({
           tickSpeed: 33.34
        });
    }

    player: Actor;
    grid: TetrisGrid;

    nextPiece: Grid;
    storedPiece: Grid = null;
    lastSwapped: Grid = null;
    totalLines = 0;

    score: number;
    level: number;

    isPaused: boolean;

    gameOver: boolean; // TODO: use state var

    getNextPiece(): Grid {
        const sendThis = this.nextPiece;

        this.nextPiece = getRandPiece();
        return sendThis;
    }

    protected initialize(): boolean {

        // cache dom elements
        tetrisEl = document.getElementById("tetris");
        gridEl = document.getElementById("grid");
        pointsEl = document.getElementById("points");
        levelEl = document.getElementById("level");
        nextUpGridEl = document.getElementById("next-up-grid");
        heldGridEl = document.getElementById("holding-grid");
        this.getNextPiece = this.getNextPiece.bind(this);

        this.nextPiece = getRandPiece();

        // initialize dom elements
        for (let row = 0; row < FIELD_HEIGHT; ++row) {
            for (let col = 0; col < FIELD_WIDTH; ++col) {

                const newDiv = document.createElement("div");
                newDiv.id = "r" + row + "c" + col;
                newDiv.style.zIndex = "" + row;
                gridEl.appendChild(newDiv);
            }
        }

        for (let row = 0; row < 25; ++row) {
            nextUpGridEl.appendChild(document.createElement("div"));
            heldGridEl.appendChild(document.createElement("div"));
        }

        // attach dom event listeners
        tetrisEl.addEventListener("animationend", evt => {
            const target = evt.target as HTMLElement;

            if (evt.animationName === "small-grow" || evt.animationName === "row-clear")
                target.classList.remove(evt.animationName);
        });

        heldGridEl.addEventListener("click", evt => {
            if (this.gameOver) return;

            this.swapPiece();
        });

        // test draw blocks
        // gridEl.addEventListener("click", evt => {
        //     const target = evt.target as HTMLElement;
        //
        //     const pos = getPosFromId(target.id);
        //     if (pos.row !== -1)
        //         grid.set(pos.row, pos.col, 2);
        // });


        // create game objects
        const grid = new TetrisGrid(FIELD_HEIGHT, FIELD_WIDTH);
        const player = new Actor(grid, this.getNextPiece);

        // attach listeners
        player.onPieceConnect.addListener(actor => {
            const tiles = actor.getTileEls();
            tiles.forEach(tile => {
                tile.classList.remove("small-grow");
                tile.classList.add("small-grow");
            });

            if (this.lastSwapped)
                this.lastSwapped = null;
        });

        player.onReset.addListener(() => {
            this.drawNextPiece();
        });


        player.onLineClear.addListener(lines => {
            if (lines.length === 4) {
                this.score += 800 * this.level;
            } else if (lines.length === 3) {
                this.score += 400 * this.level;
            } else if (lines.length === 2) {
                this.score += 200 * this.level;
            } else if (lines.length === 1) {
                this.score += 100 * this.level;
            }

            this.totalLines += lines.length;

            this.level = Math.floor(this.totalLines / 5) + 1;
            player.speed = Math.max(player.startSpeed - (this.level * 80), player.maxSpeed);
        });

        player.onLose.addListener(() => {
            this.gameOver = true;
        });

        grid.onAnimEnd.addListener(animName => {
            if (animName === "line-clear") {
                this.render();
            }
        });

        this.player = player;
        this.grid = grid;

        this.reset();
        return true;
    }

    private drawPiece(piece: Grid, gridEl: HTMLElement) {
        if (!piece) return;

        const els = gridEl.children as HTMLCollectionOf<HTMLElement>;

        for (let i = 0; i < 25; ++i)
            els[i].style.background = "";

        for (let row = 0; row < piece.getHeight(); ++row) {
            for (let col = 0; col < piece.getWidth(); ++col) {
                els[(row + 1) * 5 + col + 1].style.background = PieceData[piece.get(row, col)].color;
            }
        }
    }
    
    private drawNextPiece() {
        this.drawPiece(this.nextPiece, nextUpGridEl);
    }
    
    private drawHeldPiece() {
        this.drawPiece(this.storedPiece, heldGridEl);
    }

    reset() {
        this.player.reset();
        this.score = 0;
        this.level = 1;
        this.totalLines = 0;
        this.grid.reset();
        this.gameOver = false;
        this.isPaused = false;
        this.render();
    }

    protected update(deltaTime: number): void {
        const keys = this.keyboard;
        const player = this.player;

        if (!this.gameOver) {
            if (keys.justDown("KeyX")) {
                player.rotate(player.angle + 1);
            }
            if (keys.justDown("KeyZ")) {
                player.rotate(player.angle - 1);
            }
            if (keys.justDown("ArrowUp")) {
                player.immediateDrop();
            }
            if (keys.justDown("KeyC")) {
                this.swapPiece();
            }

            if (keys.isRepeating("ArrowLeft", 200, 100)) {
                player.move(0, -1);
            }
            if (keys.isRepeating("ArrowRight", 200, 100)) {
                player.move(0, 1);
            }
            if (keys.isRepeating("ArrowDown", 200, 100)) {
                if (player.moveDownOne()) {
                    player.resetCounter();
                    ++this.score;
                    if (player.piece.intersects(this.grid, 1, 0, player.angle))
                        keys.resetRepeating("ArrowDown");
                } else {
                    keys.resetRepeating("ArrowDown");
                }
            }

            player.update(deltaTime);
        }
    }

    swapPiece() {
        if (this.lastSwapped !== this.player.piece) {
            const tempPiece = this.storedPiece;

            this.lastSwapped = this.storedPiece;
            this.storedPiece = this.player.piece;

            this.player.reset(tempPiece);
            this.drawHeldPiece();
        }
    }

    protected render(): void {
        pointsEl.innerText = this.score.toString();
        levelEl.innerText = this.level.toString();
        const tiles = gridEl.children as HTMLCollectionOf<HTMLElement>;

        for (let row = 0; row < FIELD_HEIGHT; ++row) {
            for (let col = 0; col < FIELD_WIDTH; ++col) {
                const idx = row * FIELD_WIDTH + col;
                const gridVal = this.grid.get(row, col);
                tiles[idx].style.background = gridVal === PiecesCount + 1 ? "rgba(0, 0, 0, 0.75)" : PieceData[gridVal].color;
                tiles[idx].style.boxShadow = "";
                tiles[idx].style.zIndex = "1";
                tiles[idx].style.opacity = "1";
                tiles[idx].style.border = "";
            }
        }

        this.player.render(tiles);
    }

}

// Helper to get row/col from tileEl id
function getPosFromId(id: string) {
    const matches = id.match(/(?<=[rc])\d+/g);
    return {
        row: (matches) ? parseInt(matches[0]) : -1,
        col: (matches) ? parseInt(matches[1]) : -1,
    }
}