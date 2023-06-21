# 🕹️ Grid Tetris
![Tetris Wireframe](tetris-wireframe.png)
A Tetris clone using CSS-Grid to render graphics.

## Goals

- Learn how to apply transformations and detect collisions on a grid
- Try to understand performance limitations of the DOM
- Learn Sass and incorporate it into a project

## MVP

- Game pieces
  - Fall from the sky
  - Rotation
    - Can rotate in 90 degree increments.
    - Push piece horizontally if rotation causes collision.
    - Cancel a colliding rotation if it cannot be pushed without collision.
  - Piece landing

## Stretch Goal

- Show next piece
- Up button will immediately drop piece to its furthest downward position
- Display a highlight of where piece will fall