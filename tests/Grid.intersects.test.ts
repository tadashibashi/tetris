import {Grid} from "../src/Grid";

test("empty Grid", () => {
    const grid = new Grid(2, 2, [0, 0, 0, 0]);
    const other = new Grid(2, 2, [1, 2, 3, 4]);

    expect(!grid.intersects(other, 0, 0, 0));
});

test("empty other Grid", () => {
    const grid = new Grid(2, 2, [1, 2, 3, 4]);
    const other = new Grid(2, 2, [0, 0, 0, 0]);

    expect(!grid.intersects(other, 0, 0, 0));
});

test("normal intersection", () => {
    const grid = new Grid(2, 2, [1, 2, 3, 4]);
    const other = new Grid(2, 2, [10, 0, 0, 0]);

    expect(grid.intersects(other, 0, 0, 0));
});

test("row and column offset", () => {
    const grid = new Grid(2, 2, [1, 2, 0, 0]);
    const other = new Grid(2, 2, [10, 0, 0, 0]);

    expect(grid.intersects(other, 0, 0, 0));
    expect(!grid.intersects(other, 1, 1, 0));
});

test("differing grid sizes", () => {
    const grid = new Grid(3, 2, [
        1, 2,
        0, 0,
        1, 0,
    ]);

    const other = new Grid(2, 2, [
        10, 0,
        0, 0
    ]);

    expect(grid.intersects(other, 0, 0, 0));
    expect(!grid.intersects(other, 1, 1, 0));
});

test("set angle", () => {
    const grid = new Grid(2, 2, [
        1, 0,
        0, 0,
    ]);

    const other = new Grid(2, 2, [
        2, 0,
        0, 2
    ]);

    expect(grid.intersects(other, 0, 0, 0, 0));
    expect(!grid.intersects(other, 0, 0, 1, 0));
    expect(grid.intersects(other, 0, 0, 2, 0));
    expect(!grid.intersects(other, 0, 0, 3, 0));
});

test("set other angle", () => {
    const grid = new Grid(2, 2, [
        1, 0,
        0, 1,
    ]);

    const other = new Grid(2, 2, [
        10, 0,
        0, 0
    ]);

    expect(grid.intersects(other, 0, 0, 0, 0));
    expect(!grid.intersects(other, 0, 0, 0, 1));
    expect(grid.intersects(other, 0, 0, 0, 2));
    expect(!grid.intersects(other, 0, 0, 0, 3));
});
