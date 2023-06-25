import Cookies from 'js-cookie';

export interface HighScoreData {
    score: number;
    name: string;
}

export function saveHighScores(data: HighScoreData[]) {
    Cookies.set("tetris-highscore", JSON.stringify(data), {
        expires: 365,
    });
}

export function getHighScores(): HighScoreData[] {
    const cookieStr = Cookies.get("tetris-highscore");
    if (cookieStr === undefined) {
        return new Array<HighScoreData>(0);
    }

    return JSON.parse(cookieStr);
}
