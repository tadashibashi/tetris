import { Grid } from "../src/Grid"


test("getWidth and getHeight: 0 x 0", () => {
    const grid = new Grid(0, 0);

    expect(grid.getWidth()).toBe(0);
    expect(grid.getWidth(0)).toBe(0);
    expect(grid.getWidth(1)).toBe(0);
    expect(grid.getWidth(2)).toBe(0);
    expect(grid.getWidth(3)).toBe(0);

    expect(grid.getHeight()).toBe(0);
    expect(grid.getHeight(0)).toBe(0);
    expect(grid.getHeight(1)).toBe(0);
    expect(grid.getHeight(2)).toBe(0);
    expect(grid.getHeight(3)).toBe(0);
});

test("getWidth and getHeight: 2 x 2", () => {
    const grid = new Grid(2, 2);

    expect(grid.getWidth()).toBe(2);
    expect(grid.getWidth(0)).toBe(2);
    expect(grid.getWidth(1)).toBe(2);
    expect(grid.getWidth(2)).toBe(2);
    expect(grid.getWidth(3)).toBe(2);

    expect(grid.getHeight()).toBe(2);
    expect(grid.getHeight(0)).toBe(2);
    expect(grid.getHeight(1)).toBe(2);
    expect(grid.getHeight(2)).toBe(2);
    expect(grid.getHeight(3)).toBe(2);
});

test("getWidth and getHeight: 2 x 3", () => {
    const grid = new Grid(3, 2);

    expect(grid.getWidth()).toBe(2);
    expect(grid.getWidth(0)).toBe(2);
    expect(grid.getWidth(1)).toBe(3);
    expect(grid.getWidth(2)).toBe(2);
    expect(grid.getWidth(3)).toBe(3);

    expect(grid.getHeight()).toBe(3);
    expect(grid.getHeight(0)).toBe(3);
    expect(grid.getHeight(1)).toBe(2);
    expect(grid.getHeight(2)).toBe(3);
    expect(grid.getHeight(3)).toBe(2);
});
