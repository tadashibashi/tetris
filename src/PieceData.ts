import {Grid} from "./Grid";
import {randInt} from "./Util";

type PieceInfo = {color: string, id: number, piece: Grid};
interface PieceDatabase {
    [key: string]: PieceInfo;
    None: PieceInfo;
    Stick: PieceInfo;
    L: PieceInfo;
    RevL: PieceInfo;
    StepR: PieceInfo;
    StepL: PieceInfo;
    FourProng: PieceInfo;
    Box: PieceInfo;
}

const PieceData: PieceDatabase = {
    None:  { color: "#ffffff00", id: 0, piece: null },
    Stick: { color: "skyblue", id: 1, piece: new Grid(4, 4,[
            0, 0, 1, 0,
            0, 0, 1, 0,
            0, 0, 1, 0,
            0, 0, 1, 0,
        ])},
    L:     { color: "orange", id: 2, piece: new Grid(3, 3, [
            0, 2, 0,
            0, 2, 0,
            0, 2, 2,
        ])},
    RevL:   { color: "blue", id: 3, piece: new Grid(3, 3, [
            0, 3, 0,
            0, 3, 0,
            3, 3, 0,
        ])},
    StepR: {color: "red", id: 4, piece: new Grid(3, 3, [
            0, 0, 0,
            0, 4, 4,
            4, 4, 0,
        ])},
    StepL: {color: "green", id: 5, piece: new Grid(3, 3, [
            0, 0, 0,
            5, 5, 0,
            0, 5, 5,
        ])},
    FourProng: {color: "purple", id: 6, piece: new Grid(3, 3, [
            0, 6, 0,
            6, 6, 6,
            0, 0, 0,
        ])},
    Box: {color: "gray", id: 7, piece: new Grid(2, 2, [
            7, 7,
            7, 7,
        ])}
};

const PiecesCount = 7;

function getRandPiece(): Grid {
    return PieceData[randInt(PiecesCount) + 1].piece; // + 1 to omit null piece
}

// Make Pieces accessible via id as well as name.
Object.keys(PieceData).forEach(key => {
    PieceData[PieceData[key].id] = PieceData[key];
});
Object.freeze(PieceData);
Object.seal(PieceData);

export { PieceData, getRandPiece };
