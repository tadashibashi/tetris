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

    show() {
        const overlayEl = document.getElementById("gameover-overlay");
        const displayEl = document.getElementById("highscore-text");
        overlayEl.classList.add("show");
        let str = "";
        for (let i = this.data.length-1; i >= 0; --i) {
            str +=
            `
            <p><span>${this.data.length - i} .</span> ${this.data[i].name} <span class="highscore-score">${this.data[i].score}</span></p>
            `
        }

        displayEl.innerHTML = str;
    }

    hide() {
        const displayEl = document.getElementById("gameover-overlay");
        displayEl.classList.remove("show");
    }



    private sort() {
        // sort from low to high
        this.data.sort((a, b) => a.score - b.score);
    }
}