import {Grid} from "./Grid";
import {getRandPiece, PieceData} from "./PieceData";
import {randInt} from "./Util";

export class Actor {
    // position in the main Grid
    row: number;
    col: number;

    piece: Grid;

    board: Grid;

    // 0, 1, 2, 3 for each 90deg orientation going clockwise
    angle: number;

    counter: number;
    speed: number;

    constructor(board: Grid) {
        this.board = board;
        this.speed = 1000;

        this.reset(getRandPiece());
    }

    update(dt: number) {
        // countdown counter
        this.counter -= dt;

        if (this.counter <= 0) {
            this.counter += this.speed;
            if (!this.willCollide() &&
                this.row < this.board.getHeight() - 1 - this.piece.bottomMost(this.angle)) {
                ++this.row;
            } else {
                this.connectToBoard();
            }
        }
    }

    private connectToBoard() {
        this.board.mergeInto(this.row, this.col, this.piece, this.angle);
        this.reset(getRandPiece());
    }

    move(relRow: number, relCol: number) {

        if (this.piece.intersects(this.board, this.row + relRow, this.col + relCol, this.angle)) {
            if (relRow > 0)
                this.connectToBoard();
            return;
        }

        this.row += relRow;
        this.col += relCol;

        // constrict within game board
        this.constrictBounds(
            relRow > 0,
            relCol < 0,
            relCol > 0);
    }

    private constrictBounds(checkDown: boolean = true, checkLeft: boolean = true, checkRight: boolean = true) {
        if (checkDown)
            this.row = Math.min(this.row, this.board.getHeight() - 1 - this.piece.bottomMost());
        if (checkLeft)
            this.col = Math.max(this.col, -this.piece.leftMost(this.angle));
        if (checkRight)
            this.col = Math.min(this.col,this.board.getWidth() - 1 - this.piece.rightMost(this.angle));
    }



    reset(nextPiece: Grid) {
        this.row = -4;


        this.angle = 0;
        this.counter = 0;
        this.piece = nextPiece;

        this.col = Math.round((this.board.colCount - nextPiece.colCount) / 2);
    }

    rotate(angle: number) {
        // check if rotation possible on board
        // 1. check left border
            // a. push check right, until this.piece.col === 0, if colliding, cancel rotation
        // 2. check right border
            // a. push check left, until this.piece.col === this.piece.width
        // 3. check bottom border
        this.angle = angle % 4;

        this.constrictBounds();
    }

    willCollide(relRow: number = 1, relCol: number = 0, angle?: number) {
        return this.piece.intersects(this.board,
            this.row + relRow, this.col + relCol,
            angle === undefined ? this.angle : angle, 0);
    }

    canRotateAt(relRow: number, relCol: number, angle: number): boolean {
        this.piece.leftMost(angle);

        return false;
    }

    render(tiles: HTMLCollectionOf<HTMLElement>) {
        for (let row = 0; row < this.piece.rowCount; ++row) {
            if (row + this.row >= this.board.rowCount || row + this.row < 0) continue;

            for (let col = 0; col < this.piece.colCount; ++col) {
                if (col + this.col >= this.board.colCount || col + this.col < 0) continue;

                const pieceIdx = this.piece.get(row, col, this.angle)
                if (pieceIdx) {
                    const tileIdx = (row + this.row) * this.board.colCount + col + this.col;
                    tiles[tileIdx].style.background = PieceData[pieceIdx].color;
                }
            }
        }
    }
}