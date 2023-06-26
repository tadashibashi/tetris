# 🕹️ Grid Tetris
![Current Wireframe](tetris-wireframe-2.png)
A Tetris clone using pure CSS3 to render graphics.

Play a live build <a href="https://code.aaronishibashi.com/tetris/" target="_blank">here</a>!

### Tools

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

### Why

I made this project with some goals in mind:
- Learn how to apply transformations and detect collisions on a grid
- Use event polling in a DOM setting
- Learn performance limitations of the DOM
- Use Yarn package manager

![Tetris Wireframe](tetris-wireframe.png)

*Wireframe Draft*

## Stretch Goal

- [x] Pieces are immediately drop-able
- [x] Show next piece
- [x] Pieces progressively fall at a faster rate
- [ ] Detect & display double, triple, quadruple row clears
- [ ] Audio (SFX, Music)
