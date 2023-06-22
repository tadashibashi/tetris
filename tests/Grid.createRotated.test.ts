import {Grid} from "../src/Grid";

test("Grid get angle 0", () => {
    const grid = new Grid(5, 4, new Uint8Array([
        4, 0, 1, 0,
        3, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        2, 0, 0, 1,
    ]));



    const rotated = grid.createRotated(0);
    expect(rotated.grid).toEqual(new Uint8Array([
        4, 0, 1, 0,
        3, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        2, 0, 0, 1,
    ]));
});

test("Grid get angle 1", () => {
    const grid = new Grid(5, 4, new Uint8Array([
        4, 0, 1, 0,
        3, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        2, 0, 0, 1,
    ]));

    const rotated = grid.createRotated(1);
    expect(rotated.grid).toEqual(new Uint8Array([
        2, 0, 0, 3, 4,
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 1,
        1, 0, 0, 0, 0,
    ]));
});

test("Grid get angle 2", () => {
    const grid = new Grid(5, 4, new Uint8Array([
        4, 0, 1, 0,
        3, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        2, 0, 0, 1,
    ]));

    const rotated = grid.createRotated(2);
    expect(rotated.grid).toEqual(new Uint8Array([
        1, 0, 0, 2,
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 3,
        0, 1, 0, 4,
    ]));
});

test("Grid get angle 3", () => {
    const grid = new Grid(5, 4, new Uint8Array([
        4, 0, 1, 0,
        3, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        2, 0, 0, 1,
    ]));

    const rotated = grid.createRotated(3);
    expect(rotated.grid).toEqual(new Uint8Array([
        0, 0, 0, 0, 1,
        1, 1, 1, 1, 0,
        0, 0, 0, 0, 0,
        4, 3, 0, 0, 2,
    ]));
});
