import {getHighScores, HighScoreData, saveHighScores} from "./Storage";

const MAX_SCORES = 10;

export class HighScoreBoard {
    data: HighScoreData[];
    constructor() {
        this.load();
    }

    /**
     * Automatically called in constructor.
     * Reload scores from local storage, overwrites internal data.
     * Make sure to save before reloading!
     */
    public load() {
        this.data = getHighScores();
        while(this.data.length < MAX_SCORES)
            this.data.push({score: 0, name: ""});
        this.sort();
    }

    /**
     * Saves internal data to local storage.
     */
    public save() {
        this.sort();
        saveHighScores(this.data);
    }

    /**
     * Checks where score should be inserted into the highscore board
     * @param score
     * @returns index to insert, and -1 if score did not qualify
     */
    public scoreQualifies(score: number) {
        let i;
        for (i = 0; i < this.data.length; ++i) {
            if (score < this.data[i].score) break;
        }

        return i - 1;
    }

    /**
     * Inserts a score into the highscore board.
     * Check with scoreQualifies to see if it should be inserted,
     * and at which index.
     */
    public insertScore(score: number, name: string, index: number) {
        this.data.splice(index, 0, {score, name});
        this.data.shift();
    }

    get scores() { return this.data; }

    get highestScore() {
        return this.data.length === 0 ? 0 : this.data[this.data.length-1].score;
    }

    private sort() {
        // sort from low to high
        this.data.sort((a, b) => a.score - b.score);
    }
}