import {Grid} from "./Grid";
import {PieceData} from "./PieceData";
import {TetrisGrid} from "./TetrisGrid";
import {Delegate} from "./WebAA";
import {mod} from "./Util";

export class Actor {
    // position in the main Grid
    row: number;
    col: number;
    piece: Grid;
    grid: TetrisGrid;

    // 0, 1, 2, 3 for each 90deg orientation going clockwise
    angle: number;
    counter: number;
    speed: number;
    isPaused: boolean;

    getNextPiece: () => Grid;

    onPieceConnect: Delegate<[Actor]>;
    onLose: Delegate<[]>;
    onLineClear: Delegate<[number[]]>;

    constructor(grid: TetrisGrid, getNextPiece: () => Grid) {
        this.grid = grid;
        this.speed = 1000;
        this.isPaused = false;
        this.getNextPiece = getNextPiece;

        this.onPieceConnect = new Delegate<[Actor]>;
        this.onLineClear = new Delegate<[number[]]>;
        this.onLose = new Delegate<[]>;
        this.reset(getNextPiece());
    }

    update(dt: number) {
        if (this.isPaused) return;

        // countdown counter
        this.counter -= dt;

        if (this.counter <= 0) {
            this.counter += this.speed;
            this.moveDownOne();
        }
    }

    resetCounter() {
        this.counter = this.speed;
    }

    private connectToBoard() {
        this.grid.mergeInto(this.row, this.col, this.piece, this.angle);

        // Check for full rows cleared
        const rowsCleared = this.grid.processFullRows();
        if (rowsCleared.length > 0) {
            const tiles = document.getElementById("grid").children;
            rowsCleared.forEach(row => {
                for (let col = 0; col < this.grid.getWidth(); ++col) {
                    const tile = tiles[row * this.grid.getWidth() + col];
                    tile.classList.remove("row-clear");
                    tile.classList.add("row-clear");
                }

            });
            this.onLineClear.invoke(rowsCleared);
        }

        console.log(this.row, -this.piece.topMost(this.angle))
        // Check for loss
        if (this.row < -this.piece.topMost(this.angle)) {

            this.grid.loseAnim();
            this.isPaused = true;
            this.onLose.invoke();
        }

        this.onPieceConnect.invoke(this);

        this.reset(this.getNextPiece());
    }

    /**
     * Moves piece down one row in the grid. Returns false if move was prevented, and true if moved.
     */
    moveDownOne() {
        if (this.piece.intersects(this.grid, this.row + 1, this.col, this.angle, 0) ||
            this.row + 1 > this.grid.getHeight() - 1 - this.piece.bottomMost(this.angle)) {
            this.connectToBoard();
            return false;
        }

        this.move(1, 0);
        return true;
    }

    /**
     * Move piece, constricting its placement by the grid boundaries
     * @param relRow
     * @param relCol
     */
    move(relRow: number, relCol: number) {
        if (this.piece.intersects(this.grid, this.row + relRow, this.col + relCol, this.angle, 0))
            return;

        this.row += relRow;
        this.col += relCol;

        // constrict within game board
        this.constrictBounds(
            relRow > 0,
            relCol < 0,
            relCol > 0);

        return false;
    }

    immediateDrop() {
        let row = 1;
        const bottomMost = this.piece.bottomMost(this.angle);
        while (!this.piece.intersects(this.grid,row + this.row, this.col, this.angle) && row + this.row < this.grid.getHeight() - bottomMost)
            ++row;

        this.move(row-1, 0);
        this.connectToBoard();
        this.counter = this.speed;
    }

    getTileEls(): HTMLDivElement[] {
        const tiles: HTMLDivElement[] = [];
        const tileEls = document.getElementById("grid").children;

        const gridWidth = this.grid.getWidth();
        const gridHeight = this.grid.getHeight();
        const pieceWidth = this.piece.getWidth(this.angle);
        const pieceHeight = this.piece.getHeight(this.angle);

        for (let pieceRow = 0; pieceRow < pieceHeight; ++pieceRow) {
            for (let pieceCol = 0; pieceCol < pieceWidth; ++pieceCol) {
                const gridRow = pieceRow + this.row;
                const gridCol = pieceCol + this.col;
                console.log("gridRow:", gridRow, "gridCol:", gridCol);

                if (gridCol >= gridWidth || gridCol < 0) continue;
                if (gridRow >= gridHeight || gridRow < 0) continue;

                if (this.piece.get(pieceRow, pieceCol, this.angle)) {
                    tiles.push(tileEls[gridRow * gridWidth + gridCol] as HTMLDivElement);
                }
            }
        }

        return tiles;
    }

    private constrictBounds(checkDown: boolean = true, checkLeft: boolean = true, checkRight: boolean = true) {
        if (checkDown)
            this.row = Math.min(this.row, this.grid.getHeight() - 1 - this.piece.bottomMost(this.angle));
        if (checkLeft)
            this.col = Math.max(this.col, -this.piece.leftMost(this.angle));
        if (checkRight)
            this.col = Math.min(this.col,this.grid.getWidth() - 1 - this.piece.rightMost(this.angle));
    }


    private outboundsLeft(colRel: number  = 0, angle: number = 0): boolean {
        return this.col + colRel < -this.piece.leftMost(angle);
    }

    private outboundsRight(colRel: number = 0, angle: number = 0): boolean {
        return this.col + colRel > this.grid.getWidth() - 1 - this.piece.rightMost(angle);
    }

    private outboundsDown(rowRel: number = 0, angle: number = 0): boolean {
        return this.row + rowRel > this.grid.getHeight() - 1 - this.piece.bottomMost(angle);
    }

    private outboundsTop(rowRel: number = 0, angle: number = 0): boolean {
        return this.row + rowRel < -this.piece.topMost(angle);
    }



    reset(nextPiece: Grid) {
        this.row = -nextPiece.bottomMost() - 1;

        this.angle = 0;
        this.counter = this.speed;
        this.piece = nextPiece;

        this.col = Math.round((this.grid.colCount - nextPiece.colCount) / 2);
    }

    rotate(angle: number) {
        angle = mod(angle, 4);
        let col = this.col;
        let row = this.row;

        if (!this.piece.intersects(this.grid, row, col, angle, 0) &&
            !this.outboundsLeft(0, angle) &&
            !this.outboundsRight(0, angle) &&
            !this.outboundsDown(0, angle)) {
            this.angle = angle;
            return;
        }

        for (let i = 1; i < 3; ++i) {
            if (!this.piece.intersects(this.grid, row, col + i, angle, 0) &&
                !this.outboundsLeft(i, angle) &&
                !this.outboundsRight(i, angle) &&
                !this.outboundsDown(i, angle)) {
                this.angle = angle;
                this.col += i;
                return;
            }
            if (!this.piece.intersects(this.grid, row, col - i, angle, 0) &&
                !this.outboundsLeft(-i, angle) &&
                !this.outboundsRight(-i, angle) &&
                !this.outboundsDown(-i, angle)) {
                this.angle = angle;
                this.col -= i;
                return;
            }
        }

        this.constrictBounds();
    }

    willCollide(relRow: number = 1, relCol: number = 0, angle?: number) {
        return this.piece.intersects(this.grid,
            this.row + relRow, this.col + relCol,
            angle === undefined ? this.angle : angle, 0);
    }

    canRotateAt(relRow: number, relCol: number, angle: number): boolean {
        this.piece.leftMost(angle);

        return false;
    }

    render(tiles: HTMLCollectionOf<HTMLElement>) {
        for (let row = 0; row < this.piece.rowCount; ++row) {
            if (row + this.row >= this.grid.rowCount || row + this.row < 0) continue;

            for (let col = 0; col < this.piece.colCount; ++col) {
                if (col + this.col >= this.grid.colCount || col + this.col < 0) continue;

                const pieceIdx = this.piece.get(row, col, this.angle)
                if (pieceIdx) {
                    const tileIdx = (row + this.row) * this.grid.colCount + col + this.col;
                    const tile = tiles[tileIdx];
                    tile.style.background = PieceData[pieceIdx].color;
                    tile.style.boxShadow = "-.5vmin 1vmin .5vmin .5vmin rgba(0, 0, 0, 0.1)"
                }
            }
        }
    }
}