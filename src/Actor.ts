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
    startSpeed: number;
    maxSpeed: number;

    pressure: number;
    maxPressure: number;
    underPressure: boolean;

    moveRelRow: number;
    moveRelCol: number;
    nextAngle: number;

    displayShadow: boolean;

    getNextPiece: () => Grid;

    onPieceConnect: Delegate<[Actor]>;
    onLose: Delegate<[]>;
    onLineClear: Delegate<[number[]]>;
    onReset: Delegate<[]>;
    onMove: Delegate<[number, number]>;

    constructor(grid: TetrisGrid, getNextPiece: () => Grid) {
        this.startSpeed = 1000;
        this.maxSpeed = 50;
        this.grid = grid;
        this.speed = this.startSpeed;
        this.isPaused = false;
        this.getNextPiece = getNextPiece;


        this.displayShadow = true;
        this.pressure = 0;
        this.maxPressure = 200;
        this.underPressure = false;

        this.onPieceConnect = new Delegate<[Actor]>;
        this.onLineClear = new Delegate<[number[]]>;
        this.onLose = new Delegate<[]>;
        this.onReset = new Delegate;
        this.onMove = new Delegate;
        this.reset();
    }

    applyTransformation() {
        this.moveRelCol = Math.floor(this.moveRelCol); // just in case...
        this.moveRelRow = Math.floor(this.moveRelRow);

        // check horizontal motion first
        if (this.moveRelCol !== 0) {
            const dir = Math.sign(this.moveRelCol);
            let relCol = this.moveRelCol;

            while (relCol !== 0) {
                if ( (relCol < 0 && this.outboundsLeft(relCol, this.angle)) || (relCol > 0 && this.outboundsRight(relCol, this.angle)) ||
                    this.piece.intersects(this.grid, this.row, this.col + relCol, this.angle) ) {
                    relCol -= dir;
                } else {
                    break;
                }
            }

            this.moveRelCol = relCol;
        }

        if (this.moveRelRow !== 0) {
            const dir = Math.sign(this.moveRelRow);
            let relRow = this.moveRelRow;

            while (relRow !== 0) {
                // check boundaries and
                if ( (relRow > 0 && this.outboundsDown(relRow, this.angle)) ||
                    this.piece.intersects(this.grid, this.row + relRow, this.col + this.moveRelCol, this.angle) ) {

                    // if something is blocking the way downward
                    if (relRow > 0)
                        this.underPressure = true;

                    relRow -= dir;


                } else {
                    break;
                }
            }

            this.moveRelRow = relRow;
        }


        // apply rotation at new position
        if (this.nextAngle > -1)
            this.moveRelCol += this.applyAngle(this.moveRelRow, this.moveRelCol);

        // constrict within game board
        if (this.moveRelRow > 0)
            this.moveRelRow += this.constrictBoundsRows(this.row + this.moveRelRow, this.angle);

        this.moveRelCol += this.constrictBoundsCols(this.col + this.moveRelCol, this.angle,
            this.moveRelCol < 0, this.moveRelCol > 0);

        // commit movement
        this.row += this.moveRelRow;
        this.col += this.moveRelCol;

        // if (this.moveRelRow > 0) {
        //     this.underPressure = false;
        //     this.pressure = 0;
        // }

        // fire move callback here
        this.onMove.invoke(this.moveRelRow, this.moveRelCol);

        // reset movement vars
        this.moveRelRow = 0;
        this.moveRelCol = 0;
        this.nextAngle = -1;
    }

    update(dt: number) {
        if (this.isPaused) return;

        // countdown counter
        this.counter -= dt;

        this.applyTransformation();

        if (this.underPressure) {
            this.pressure += dt;
            if (this.pressure >= this.maxPressure) {
                this.connectToBoard();
            }
        }


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

        // Check for loss
        if (this.row < -this.piece.topMost(this.angle)) {

            this.grid.loseAnim();
            this.isPaused = true;
            this.onLose.invoke();
        }

        this.onPieceConnect.invoke(this);

        this.reset();
    }

    /**
     * Moves piece down one row in the grid. Returns false if move prevented, and true if moved.
     */
    moveDownOne() {
        if (this.moveRelRow === 0)
            this.move(1, 0);
    }

    /**
     * Move piece, constricting its placement by the grid boundaries
     * @param relRow
     * @param relCol
     */
    move(relRow: number, relCol: number) {
        this.moveRelRow += relRow;
        this.moveRelCol += relCol;
    }

    /**
     * Drop the actor immediately to the lowest row it can reach, and connect it to the board
     * @returns the number of rows dropped
     */
    immediateDrop(): number {
        let row = 1;
        const bottomMost = this.piece.bottomMost(this.angle);
        while (!this.piece.intersects(this.grid,row + this.row, this.col, this.angle) && row + this.row < this.grid.getHeight() - bottomMost)
            ++row;

        this.moveRelRow = 0;
        this.moveRelCol = 0;
        this.nextAngle = -1;
        this.move(row-1, 0);
        this.applyTransformation();
        this.connectToBoard();
        this.counter = this.speed;

        return row;
    }

    /**
     * Gets the tile elements that this piece is sitting on the board at its current transformation.
     */
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

                if (gridCol >= gridWidth || gridCol < 0) continue;
                if (gridRow >= gridHeight || gridRow < 0) continue;

                if (this.piece.get(pieceRow, pieceCol, this.angle)) {
                    tiles.push(tileEls[gridRow * gridWidth + gridCol] as HTMLDivElement);
                }
            }
        }

        return tiles;
    }

    /**
     * Constricts the boundaries of this Piece on the TetrisGrid, so that it won't "stick out" of the bottom.
     * @private
     * @returns true: if a change was made to the position due to constriction, or false: if no change was made.
     */
    private constrictBoundsRows(atRow: number, atAngle: number) {
        let row= Math.min(atRow, this.grid.getHeight() - 1 - this.piece.bottomMost(atAngle));
        return row - atRow;
    }

    private constrictBoundsCols(atCol: number, atAngle: number, checkLeft: boolean = true, checkRight: boolean = true) {
        let col = atCol;
        if (checkLeft)
            col = Math.max(atCol, -this.piece.leftMost(atAngle));
        if (checkRight)
            col = Math.min(atCol ,this.grid.getWidth() - 1 - this.piece.rightMost(atAngle));

        return col - atCol;
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

    restart() {
        this.reset();
        this.speed = this.startSpeed;
    }

    reset(nextPiece?: Grid) {
        if (!nextPiece)
            nextPiece = this.getNextPiece();
        let row = -nextPiece.topMost();
        let col = Math.round((this.grid.colCount - nextPiece.colCount) / 2);
        while(nextPiece.intersects(this.grid, row, col))
            --row;

        this.row = row;
        this.col = col;

        this.moveRelRow = 0;
        this.moveRelCol = 0;
        this.nextAngle = -1;

        this.pressure = 0;
        this.underPressure = false;
        this.isPaused = false;

        this.angle = 0;
        //this.speed = this.startSpeed;
        this.counter = this.speed;
        this.piece = nextPiece;

        this.onReset.invoke();
    }

    /**
     *
     * @param relRow
     * @param relCol
     * @private
     * @returns the relative horizontal motion caused by the application of the angle
     */
    private applyAngle(relRow: number, relCol: number) {
        let col = this.col + relCol;
        let row = this.row + relRow;
        let angle = this.nextAngle;

        if (!this.piece.intersects(this.grid, row, col, angle, 0) &&
            !this.outboundsLeft(relCol, angle) &&
            !this.outboundsRight(relCol, angle) &&
            !this.outboundsDown(relRow, angle)) {
            this.angle = angle;
            return 0;
        }

        for (let i = 1; i < 3; ++i) {
            if (!this.piece.intersects(this.grid, row, col + i, angle, 0) &&
                !this.outboundsLeft(relCol + i, angle) &&
                !this.outboundsRight(relCol + i, angle) &&
                !this.outboundsDown(relRow + i, angle)) {
                this.angle = angle;
                return i;
            }
            if (!this.piece.intersects(this.grid, row, col - i, angle, 0) &&
                !this.outboundsLeft(relCol-i, angle) &&
                !this.outboundsRight(relCol-i, angle) &&
                !this.outboundsDown(relRow-i, angle)) {
                this.angle = angle;
                return -i;
            }
        }
    }

    rotate(angle: number) {
        this.nextAngle = mod(angle, 4);
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

        // Get the row to display the shadow at
        let shadowRow = 0;
        if (this.displayShadow) {
            shadowRow = 1;
            while (!this.piece.intersects(this.grid, this.row + shadowRow, this.col, this.angle) && !this.outboundsDown(shadowRow, this.angle))
                ++shadowRow;
            --shadowRow;
        }

        for (let row = 0; row < this.piece.rowCount; ++row) {

            for (let col = 0; col < this.piece.colCount; ++col) {

                const pieceIdx = this.piece.get(row, col, this.angle)
                if (pieceIdx !== 0) {
                    if (shadowRow !== 0) { // only need to draw ghost/shadow when not overlapped by player
                        const shadowTile = tiles[(row + this.row + shadowRow) * this.grid.colCount + col + this.col];

                        if (shadowTile) {
                            shadowTile.style.border = ".5vmin " + PieceData[pieceIdx].color + " dashed";
                            shadowTile.style.opacity = ".6";
                            shadowTile.style.background = "rgba(0, 0, 0, .1)";
                        } else {
                            console.warn("Actor.render: shadowTile was undefined.");
                        }

                    }

                    if (row + this.row >= this.grid.rowCount || row + this.row < 0) continue;
                    if (col + this.col >= this.grid.colCount || col + this.col < 0) continue;

                    const tileIdx = (row + this.row) * this.grid.colCount + col + this.col;
                    const tile = tiles[tileIdx];
                    tile.style.background = PieceData[pieceIdx].color;
                    tile.style.boxShadow = "-.5vmin 1vmin .5vmin .5vmin rgba(0, 0, 0, 0.1)";
                    tile.style.opacity = "1";
                    tile.style.border = "";
                }
            }
        }
    }
}