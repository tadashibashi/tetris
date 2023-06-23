import {Grid} from "./Grid";
import {Pieces} from "./Pieces";

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

        this.reset(Pieces[Math.floor(Math.random() * 7) + 1].piece);
    }

    update(dt: number) {
        // countdown counter
        this.counter -= dt;

        if (this.counter <= 0) {
            this.counter += this.speed;
            if (!this.willCollide()) { //TODO: BUGFIX!
                ++this.row;
            } else {
                // attach to board
            }
        }
    }

    move(relRow: number, relCol: number) {

    }



    reset(nextPiece: Grid) {
        this.row = -4;


        this.angle = 0;
        this.counter = 0;
        this.piece = nextPiece;

        this.col = Math.round((this.board.colCount - nextPiece.colCount) / 2);
    }

    setAngle(angle: number) {
        this.angle = angle % 4;
    }

    willCollide(relRow: number = 1, relCol: number = 0) {
        return this.piece.intersects(this.board,
            this.row + relRow, this.col + relCol,
            this.angle, 0)
    }

    render(tiles: HTMLCollectionOf<HTMLElement>) {
        for (let row = 0; row < this.piece.rowCount; ++row) {
            if (row + this.row >= this.board.rowCount || row + this.row < 0) continue;

            for (let col = 0; col < this.piece.colCount; ++col) {
                if (col + this.col >= this.board.colCount || col + this.col < 0) continue;

                const pieceIdx = this.piece.get(row, col, this.angle)
                if (pieceIdx) {
                    const tileIdx = (row + this.row) * this.board.colCount + col + this.col;
                    tiles[tileIdx].style.background = Pieces[pieceIdx].color;
                }
            }
        }
    }
}