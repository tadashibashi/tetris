# Grid Tetris

![Current Wireframe](tetris-wireframe-2.png)

A Tetris clone using CSS to render graphics.

Play a live build <a href="https://code.aaronishibashi.com/tetris/" target="_blank">here</a>!

## 🕹️ Controls
| Action            | Key                         |
|-------------------|-----------------------------|
| Move Horizontally | `Left` & `Right` Arrow Keys |
| Move Down         | `Down` Arrow Key            |
| Immediate Drop    | `Up` Arrow Key              |
| Rotate Block      | `Z` or `X`                  | 

| Options        | Key                        |
|----------------|----------------------------|
| Toggle Pause   | `P` or click Pause Button  |
| Toggle Target  | `T` or click Target Button |


## Technologies Used

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

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

## Feature List
- [x] MVP Gameplay
- [x] Pieces are immediately dropable
- [x] Show next piece
- [x] Hold a piece to the side
- [x] Pieces progressively fall at a faster rate
- [x] High Score Board
- [ ] Detect & display double, triple, quadruple row clears
- [ ] Audio (SFX, Music)

## Why

- This project was made in under a week for my first General Assembly software project
- I wanted to challenge myself to apply transformations to shapes and detect collisions on a grid
- Use event polling in the DOM vs. the more typical event-driven programming
- Try to understand DOM rendering & animation limitations
- Make a game from scratch without a framework

![Tetris Wireframe](tetris-wireframe.png)

*Wireframe Draft*


## Next Steps

- PvP online battle Tetris?
