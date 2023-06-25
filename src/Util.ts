
export function randInt(n: number) {
    return Math.floor(Math.random() * n);
}

export function rand(n: number) {
    return Math.random() * n;
}

/**
 * Behaves as a true mod function, even with negative numbers.
 * @param x
 * @param n
 */
export function mod(x: number, n: number) {
    return (x % n + n) % n;
}

export enum Browser {
    Chrome,
    IExplorer,
    FireFox,
    Safari,
    Brave,
    Unknown,
}

export const detectBrowser = (function() {
    // code adapted from: https://www.geeksforgeeks.org/how-to-detect-the-user-browser-safari-chrome-ie-firefox-and-opera-using-javascript/#
    const userAgent = navigator.userAgent;
    const chrome = userAgent.indexOf("Chrome") > -1;
    const explorer = userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("rv:") > -1;
    const firefox = userAgent.indexOf("Firefox") > -1;

    const safari = userAgent.indexOf("Safari") > -1 && !chrome;
    // @ts-ignore
    const brave = navigator.brave !== undefined;

    return function(browserType: Browser): boolean {
        switch(browserType) {
            case Browser.Brave:
                return brave;
            case Browser.Chrome:
                return chrome;
            case Browser.FireFox:
                return firefox;
            case Browser.Safari:
                return safari;
            case Browser.IExplorer:
                return explorer;
        }

        return false;
    }
})();

/**
 * Interpolate between n and dest by a given percentage.
 * @param n      - current number
 * @param dest   - destination number
 * @param amount - percentage to interpolate (0.0-1.0)
 */
export function lerp(n: number, dest: number, amount: number) {
    return n + (dest - n) * amount;
}