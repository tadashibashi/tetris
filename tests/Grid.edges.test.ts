import { Grid } from "../src/Grid";

test("topMost regular angle", () => {
    const grid = new Grid(4, 4, [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ]);

    // No non-zero items on grid
    expect(grid.topMost()).toBe(-1);

    grid.set(3, 3, 1);
    expect(grid.topMost()).toBe(3);

    grid.set(2, 2, 1);
    expect(grid.topMost()).toBe(2);

    grid.set(1, 1, 2);
    expect(grid.topMost()).toBe(1);

    grid.set(0, 0, 3);
    expect(grid.topMost()).toBe(0);
});

test("topMost different angles", () => {
    const grid = new Grid(4, 4, [
        0, 0, 0, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ]);

    // No non-zero items on grid
    expect(grid.topMost(0)).toBe(0);
    expect(grid.topMost(1)).toBe(3);
    expect(grid.topMost(2)).toBe(3);
    expect(grid.topMost(3)).toBe(0);
});

test("rightMost regular angle", () => {
    const grid = new Grid(4, 4, [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ]);

    // No non-zero items on grid
    expect(grid.rightMost()).toBe(-1);

    grid.set(0, 0, 1);
    expect(grid.rightMost()).toBe(0);

    grid.set(1, 1, 1);
    expect(grid.rightMost()).toBe(1);

    grid.set(2, 2, 2);
    expect(grid.rightMost()).toBe(2);

    grid.set(3, 3, 3);
    expect(grid.rightMost()).toBe(3);
});

test("rightMost different angles", () => {
    const grid = new Grid(4, 4, [
        0, 0, 0, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ]);

    // No non-zero items on grid
    expect(grid.rightMost(0)).toBe(3);
    expect(grid.rightMost(1)).toBe(3);
    expect(grid.rightMost(2)).toBe(0);
    expect(grid.rightMost(3)).toBe(0);
});

test("bottomMost regular angle", () => {
    const grid = new Grid(4, 4, [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ]);

    // No non-zero items on grid
    expect(grid.bottomMost()).toBe(-1);

    grid.set(0, 0, 1);
    expect(grid.bottomMost()).toBe(0);

    grid.set(1, 1, 1);
    expect(grid.bottomMost()).toBe(1);

    grid.set(2, 2, 2);
    expect(grid.bottomMost()).toBe(2);

    grid.set(3, 3, 3);
    expect(grid.bottomMost()).toBe(3);
});

test("bottomMost different angles", () => {
    const grid = new Grid(4, 4, [
        0, 0, 0, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ]);

    // No non-zero items on grid
    expect(grid.bottomMost(0)).toBe(0);
    expect(grid.bottomMost(1)).toBe(3);
    expect(grid.bottomMost(2)).toBe(3);
    expect(grid.bottomMost(3)).toBe(0);
});

test("leftMost regular angle", () => {
    const grid = new Grid(4, 4, [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ]);

    // No non-zero items on grid
    expect(grid.leftMost()).toBe(-1);

    grid.set(3, 3, 1);
    expect(grid.leftMost()).toBe(3);

    grid.set(2, 2, 1);
    expect(grid.leftMost()).toBe(2);

    grid.set(1, 1, 1);
    expect(grid.leftMost()).toBe(1);

    grid.set(0, 0, 1);
    expect(grid.leftMost()).toBe(0);
});

test("leftMost different angles", () => {
    const grid = new Grid(4, 4, [
        0, 0, 0, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ]);

    // No non-zero items on grid
    expect(grid.leftMost(0)).toBe(3);
    expect(grid.leftMost(1)).toBe(3);
    expect(grid.leftMost(2)).toBe(0);
    expect(grid.leftMost(3)).toBe(0);
});
