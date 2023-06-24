
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
