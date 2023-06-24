import {Grid} from "./Grid";
import {Delegate} from "./Delegate"
import {PieceData, PiecesCount} from "./PieceData";

/**
 * Extension of the Grid class that contains Tetris-specific animations, edge case functions, etc.
 */
export class TetrisGrid extends Grid {
    onAnimEnd: Delegate<["lose" | "line-clear"]>; // on animation end: "lose", "line-clear"

    constructor(rowHeight: number, colWidth: number) {
        super(rowHeight, colWidth);

        this.onAnimEnd = new Delegate;
    }

    loseAnim() {
        const tiles = document.getElementById("grid").children as HTMLCollectionOf<HTMLDivElement>;
        let idx = 0;
        const interval = setInterval(() => {
            this.grid[idx] = PiecesCount + 1;
            tiles[idx].classList.add("small-grow")
            ++idx;
            if (idx >= this.grid.length) {
                clearInterval(interval);
                this.onAnimEnd.invoke("lose");
            }

        }, 16.67);
    }

    /**
     * Activates animations for full horizontal rows, removing them, thus mutating the grid.
     * Returns the number of rows that were completed
     */
    processFullRows(): number[] {
        let completeRows: number[] = [];
        for (let row = 0; row < this.getHeight(); ++row) {

            let isComplete = true;
            for (let col = 0; col < this.getWidth(); ++col) {
                if (this.get(row, col) === 0) {
                    isComplete = false;
                    break;
                }
            }

            if (isComplete) {
                completeRows.push(row);
            }
        }

        // set line-clear class to each full row

        // timeout to remove rows from grid
        setTimeout(() => {
            completeRows.forEach(row => {
                const gridWidth = this.getWidth();

                // push down rows
                if (row !== 0) {
                    this.grid.copyWithin(gridWidth, 0, row * gridWidth);
                }

                // clear top row
                for (let i = 0; i < gridWidth; ++i) {
                    this.grid[i] = 0;
                }
            });


            this.onAnimEnd.invoke("line-clear");
        }, 250);


        return completeRows;
    }
}