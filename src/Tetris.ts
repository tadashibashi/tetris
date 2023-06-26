import {Game} from "./Game";
import {Actor} from "./Actor";
import {TetrisGrid} from "./TetrisGrid";
import {Grid} from "./Grid";
import {getRandPiece, PieceData, PiecesCount} from "./PieceData";
import {HighScoreBoard} from "./HighScoreBoard";

let tetrisEl: HTMLElement;
let gridEl: HTMLElement;
let highscoreEl: HTMLElement;
let highscoreFormEl: HTMLElement;
let highscoreSubmitEl: HTMLElement;
let pointsEl: HTMLElement;
let levelEl: HTMLSpanElement;
let linesEl: HTMLSpanElement;
let nextUpGridEl: HTMLElement;
let heldGridEl: HTMLElement;
let pauseBtnEl: HTMLElement;
let targetBtnEl: HTMLElement;
let gameOverOverlayEl: HTMLElement;
let tryAgainBtnEl: HTMLElement;

const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;

export class Tetris extends Game {

    constructor() {
        super({
           tickSpeed: 16.67
        });
    }

    player: Actor;
    grid: TetrisGrid;

    nextPiece: Grid;
    storedPiece: Grid = null;
    lastSwapped: Grid = null;
    totalLines = 0;
    scores: HighScoreBoard;

    score: number;
    level: number;

    isPaused: boolean;

    gameOver: boolean; // TODO: use state var

    // Player pressed arrow down, check for score
    arrowDownCheck: boolean;

    getNextPiece(): Grid {
        const sendThis = this.nextPiece;

        this.nextPiece = getRandPiece();
        return sendThis;
    }

    eraseAll() {

    }

    protected initialize(): boolean {
        // bind callback
        this.getNextPiece = this.getNextPiece.bind(this);

        this.nextPiece = getRandPiece();

        // cache dom elements
        tetrisEl = document.getElementById("tetris");
        gridEl = document.getElementById("grid");
        highscoreEl = document.getElementById("highscore");
        highscoreFormEl = document.getElementById("highscore-form");
        highscoreSubmitEl = document.getElementById("highscore-submit");
        pointsEl = document.getElementById("points");
        levelEl = document.getElementById("level");
        linesEl = document.getElementById("lines");
        nextUpGridEl = document.getElementById("next-up-grid");
        heldGridEl = document.getElementById("holding-grid");
        pauseBtnEl = document.getElementById("pause-btn");
        targetBtnEl = document.getElementById("target-btn");
        gameOverOverlayEl = document.getElementById("gameover-overlay");
        tryAgainBtnEl = document.getElementById("try-again-btn");


        // initialize dom elements
        for (let row = 0; row < FIELD_HEIGHT; ++row) {
            for (let col = 0; col < FIELD_WIDTH; ++col) {

                const newDiv = document.createElement("div");
                newDiv.id = "r" + row + "c" + col;
                newDiv.style.zIndex = "" + row;
                gridEl.appendChild(newDiv);
            }
        }

        // create small grids for "hold", and "next up"
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
            if (this.gameOver || this.isPaused) return;

            this.swapPiece();
        });

        pauseBtnEl.addEventListener("click", evt => {
            if (this.isPaused) {
                pauseBtnEl.children[0].className = "fa-solid fa-pause";
                this.isPaused = false;
            } else {
                pauseBtnEl.children[0].className = "fa-solid fa-play";
                this.isPaused = true;
            }
        });

        targetBtnEl.addEventListener("click", evt => {
            this.player.displayShadow = !this.player.displayShadow;
        });

        highscoreSubmitEl.addEventListener("click", evt => {
            if (!this.gameOver) return;
            if (!highscoreFormEl.classList.contains("show")) return;

            const input = document.querySelector("#highscore-form input") as HTMLInputElement;
            if (!input) {
                console.warn("Failed to get highscore input element!");
                return;
            }

            if (input.value.length === 0) return;

            const idx = this.scores.scoreQualifies(this.score);
            this.scores.insertScore(this.score, input.value, idx);
            this.scores.save();
            highscoreFormEl.classList.remove("show");

            this.scores.show();
        });

        tryAgainBtnEl.addEventListener("click", evt => {
            if (!this.gameOver) return;
            if (!gameOverOverlayEl.classList.contains("show")) return;

            // gameOverOverlayEl.classList.remove("show");
            this.scores.hide(); // does this ^
            this.reset();
        });


        // create game objects
        const grid = new TetrisGrid(FIELD_HEIGHT, FIELD_WIDTH);
        const player = new Actor(grid, this.getNextPiece);
        const highscores = new HighScoreBoard();

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
            player.speed = Math.max(player.startSpeed - (this.level * 50), player.maxSpeed);
        });

        player.onLose.addListener(() => {
            this.gameOver = true;
        });

        player.onMove.addListener((relRow, relCol) => {
            if (this.arrowDownCheck && relRow > 0) {
                ++this.score;
            }

            this.arrowDownCheck = false;
        });

        grid.onAnimEnd.addListener(animName => {
            if (animName === "line-clear") {
                this.render();
            }
            if (animName === "lose") {
                const place = this.scores.scoreQualifies(this.score);
                if (place > -1) {
                    const highScoreDescEl = document.getElementById("highscore-description");
                    highScoreDescEl.innerText = "You got #" + (this.scores.data.length - place).toString() + " place!";
                    this.keyboard.allowDefault = true;
                    highscoreFormEl.classList.add("show");
                } else {
                    this.scores.show();
                    this.keyboard.allowDefault = true;
                }

            }
        });

        this.player = player;
        this.grid = grid;
        this.scores = highscores;

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
        this.player.restart();
        this.score = 0;
        this.level = 1;
        this.totalLines = 0;
        this.grid.reset();
        this.gameOver = false;
        this.isPaused = false;
        this.arrowDownCheck = false;
        this.keyboard.allowDefault = false;
        this.render();
    }

    protected update(deltaTime: number): void {
        const keys = this.keyboard;
        const player = this.player;

        if (keys.justDown("KeyP")) {
            pauseBtnEl.click();
        }
        if (keys.justDown("KeyT")) {
            targetBtnEl.click();
        }

        if (this.gameOver) {
            if (keys.justDown("Enter")) {
                if (highscoreFormEl.classList.contains("show")) {
                    highscoreSubmitEl.click();
                }
                if (gameOverOverlayEl.classList.contains("show")) {
                    tryAgainBtnEl.click();
                }
            }
        }



        if (!this.gameOver && !this.isPaused) {
            if (keys.isDown("ArrowDown")) {
                player.resetCounter();
            }
            if (keys.justDown("KeyX")) {
                player.rotate(player.angle + 1);
            }
            if (keys.justDown("KeyZ")) {
                player.rotate(player.angle - 1);
            }
            if (keys.justDown("ArrowUp")) {
                this.score += player.immediateDrop();
            }
            if (keys.justDown("KeyC")) {
                this.swapPiece();
            }

            if (keys.isRepeating("ArrowLeft", 100, 65)) {
                player.move(0, -1);
            }
            if (keys.isRepeating("ArrowRight", 100, 65)) {
                player.move(0, 1);
            }
            if (keys.isRepeating("ArrowDown", 100, 65)) {
                player.moveDownOne();

                this.arrowDownCheck = true;
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
        highscoreEl.innerText = Math.max(this.scores.highestScore, this.score).toString();
        pointsEl.innerText = this.score.toString();
        levelEl.innerText = this.level.toString();
        linesEl.innerText = this.totalLines.toString();
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
