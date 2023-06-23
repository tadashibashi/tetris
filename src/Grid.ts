
export class Grid {
    readonly rowCount: number;
    readonly colCount: number;
    grid: Uint8Array;

    /**
     * @param rows  - number of rows
     * @param cols  - number of cols
     * @param arr   - if provided, it will be copied into the internal grid.
     * (Ownership of ArrayLike maintained by user). Please ensure that
     * `width * height === arr.length`
     */
    constructor(rows: number, cols: number, arr?: ArrayLike<number>) {
        this.grid = arr ? new Uint8Array(arr) : new Uint8Array(rows * cols);
        this.rowCount = rows;
        this.colCount = cols;

        if (arr) console.assert(arr.length === rows * cols);
    }

    /**
     * Merge another Grid into this one if it contains non 0 values.
     * It will overwrite anything at the location.
     * @param startRow   - row in this Grid at which to perform the merge
     * @param startCol   - column in this Grid at which to perform the merge
     * @param other      - the other Grid that will merge into this one.
     * @param otherAngle - the angle at which to transform the other Grid while performing the merge.
     * Default: 0 (no transformation).
     */
    mergeInto(startRow: number, startCol: number, other: Grid, otherAngle: number = 0) {
        const rowCount = (otherAngle % 2 === 0) ? other.rowCount : other.colCount;
        const colCount = (otherAngle % 2 === 0) ? other.colCount : other.rowCount;

        for (let row = 0; row < rowCount; ++row) {
            for (let col = 0; col < colCount; ++col) {
                const otherVal = other.get(row, col, otherAngle);
                if (otherVal !== 0) {
                    this.set(row + startRow, col + startCol, otherVal);
                }
            }
        }
    }


    /**
     * Returns the left-most column where there is a non-zero value in this grid
     * @param angle - the angle at which to project the grid. (angle * 90deg clockwise)
     * @returns right-most row, starting from the 0, which represents the left-most row.
     * If there is no non-zero value in the grid, -1 is returned.
     */
    leftMost(angle: number = 0): number {
        const rowCount = (angle % 2 === 0) ? this.rowCount : this.colCount;
        const colCount = (angle % 2 === 0) ? this.colCount : this.rowCount;

        for (let col = 0; col < colCount; ++col) {
            for (let row = 0; row < rowCount; ++row) {
                if (this.get(row, col, angle))
                    return col;
            }
        }

        return -1;
    }

    /**
     * Returns the right-most column where there is a non-zero value in this grid
     * @param angle - the angle at which to project the grid. (angle * 90deg clockwise)
     * @returns right-most row, starting from the 0, which represents the left-most row.
     * If there is no non-zero value in the grid, -1 is returned.
     */
    rightMost(angle: number = 0): number {
        const rowCount = (angle % 2 === 0) ? this.rowCount : this.colCount;
        const colCount = (angle % 2 === 0) ? this.colCount : this.rowCount;

        for (let col = colCount-1; col >= 0; --col) {
            for (let row = 0; row < rowCount; ++row) {
                if (this.get(row, col, angle))
                    return col;
            }
        }

        return -1;
    }


    /**
     * Returns the top-most row where there is a non-zero value in this grid
     * @param angle - the angle at which to project the grid. (angle * 90deg clockwise)
     * @returns top-most row, starting from 0, which represents the top row.
     * If there is no non-zero value in the grid, rowCount-1 is returned.
     */
    topMost(angle: number = 0): number {
        const rowCount = (angle % 2 === 0) ? this.rowCount : this.colCount;
        const colCount = (angle % 2 === 0) ? this.colCount : this.rowCount;

        for (let row = 0; row < rowCount; ++row) {
            for (let col = 0; col < colCount; ++col) {
                if (this.get(row, col, angle)) {
                    return row;
                }
            }
        }

        return -1;
    }

    /**
     * Returns the top-most row where there is a non-zero value in this grid
     * @param angle - the angle at which to project the grid. (angle * 90deg clockwise)
     * @returns top-most row, starting from 0, which represents the top row.
     * If there is no non-zero value in the grid, rowCount-1 is returned.
     */
    bottomMost(angle: number = 0): number {
        const rowCount = (angle % 2 === 0) ? this.rowCount : this.colCount;
        const colCount = (angle % 2 === 0) ? this.colCount : this.rowCount;

        for (let row = rowCount-1; row >= 0; --row) {
            for (let col = 0; col < colCount; ++col) {
                if (this.get(row, col, angle)) {
                    return row;
                }
            }
        }

        return -1;
    }



    /**
     * @param other       - other grid
     * @param startRow    - row from which to start checking at in other Grid
     * @param startColumn - column from which to start checking in other Grid
     * @param thisAngle   - angle at which calling Grid object will be tested.
     * Transformation will be: 90 * angle, in degrees clockwise.
     * Negative values will result in angle = 0.
     * @param otherAngle  - angle at which other Grid object will be tested
     */
    intersects(other: Grid, startRow: number = 0, startColumn: number = 0, thisAngle: number = 0, otherAngle: number = 0): boolean {
        const rowCount = (thisAngle % 2 === 0) ? this.rowCount : this.colCount;
        const colCount = (thisAngle % 2 === 0) ? this.colCount : this.rowCount;

        for (let row = 0; row < rowCount; ++row) {
            if (row + startRow >= other.rowCount)
                break;
            if ( row + startRow < 0)
                continue;

            for (let col = 0; col < colCount; ++col) {
                if (col + startColumn >= other.colCount)
                    break;
                if (col + startColumn < 0)
                    continue;

                if (this.get(row, col, thisAngle) !== 0 &&
                    other.get(row + startRow, col + startColumn, otherAngle) !== 0) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Creates a new Grid object that will be rotated
     * @param angle
     */
    createRotated(angle: 0 | 1 | 2 | 3): Grid {
        if (angle === 0) {  // just copy grid if no transformation
            return new Grid(this.rowCount, this.colCount,
                new Uint8Array(this.grid));
        }

        const arr = new Uint8Array(this.rowCount * this.colCount);
        const rowCount = (angle % 2 === 0) ? this.rowCount : this.colCount;
        const colCount = (angle % 2 === 0) ? this.colCount : this.rowCount;

        let i = 0;
        for (let row = 0; row < rowCount; ++row) {
            for (let col = 0; col < colCount; ++col) {
                arr[i] = this.get(row, col, angle);
                ++i;
            }
        }

        return new Grid(rowCount, colCount, arr);
    }

    get(row: number, col: number, angle: number = 0): number {
        angle = Math.floor(angle) % 4;
        switch(angle) {
            case 0:
                return this.grid[row * this.colCount + col];
            case 1:
                return this.grid[(this.rowCount - 1 - col) * this.colCount + row];
            case 2:
                return this.grid[(this.rowCount - 1 - row) * this.colCount + (this.colCount - 1 - col)];
            case 3:
                return this.grid[col * this.colCount + this.colCount - 1 - row];
        }
    }

    set(row: number, col: number, value: number): Grid {
        this.grid[this.gridToIndex(row, col)] = value;

        return this;
    }

    isFreeAt(row: number, col: number): boolean {
        return this.get(row, col) === 0;
    }

    private gridToIndex(row: number, col: number): number {
        return this.clampIndex(row * this.colCount + col);
    }

    private clampIndex(value: number): number {
        return Math.max(Math.min(value, this.rowCount * this.colCount - 1), 0);
    }

    toString(angle: 0 | 1 | 2 | 3 = 0): string {
        let str = "";
        for (let row = 0; row < this.rowCount; ++row) {
            for (let col = 0; col < this.colCount; ++col) {
                str += this.get(row, col, angle);
                if (!(row === this.rowCount-1 && col === this.colCount-1))
                    str += ", ";
            }
            str += "\n";
        }

        return str;
    }
 }
