# 🕹️ Grid Tetris

![Current Wireframe](tetris-wireframe-2.png)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

A Tetris clone using pure CSS3 to render graphics.

Play a live build <a href="https://code.aaronishibashi.com/tetris/" target="_blank">here</a>!

## Feature List
- [x] MVP Gameplay
- [x] Pieces are immediately dropable
- [x] Show next piece
- [x] Hold a piece to the side
- [x] Pieces progressively fall at a faster rate
- [ ] Detect & display double, triple, quadruple row clears
- [ ] Audio (SFX, Music)

## Installation

To build and run the project in a local server:

```shell
npm install
npm run serve
``` 
or
```shell
yarn install
yarn serve
```

## Post-Mortem

### Why

I made this project with some goals in mind:
- Learn how to apply transformations and detect collisions on a grid
- Use event polling in the DOM, and encounter possible performance limitations
- Make a game from scratch without too much framework

![Tetris Wireframe](tetris-wireframe.png)

*Wireframe Draft*

### Challenges

- Limiting player rotation and movement from collisions within grid bounds
  - **Problem**: Implementing this feature was not hard in and of itself, but combining it
  with the feature I labelled "pressure", where player attachment to the board is delayed 
  proved trying. Sometimes the block would attach to the board "floating midair".
  - **Solution**: I needed to refactor the movement into a once-called function 
  every frame,
  instead of being called at various places.
- Writing overlays proved somewhat hard to manage
  - **Problem**: Overlays are all hard-coded into the html file. I did not approach UI in 
    a modular component fashion. This left all UI in an invisible state sitting in the middle
    of the board, preventing clicks getting to the right UI button or input.
  - **Solution**: I used a class to toggle the hide/show behavior. By setting pointer-events 
    to "none" when hidden fixed the layered issue, while it would be set back to "all" when shown.
    These kinds of problems will hopefully resolve itself as I use React, or attempt 
    to write future UI with greater finesse.
