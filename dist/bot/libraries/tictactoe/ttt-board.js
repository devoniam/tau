"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var boardEnums;
(function (boardEnums) {
    let SpaceEnum;
    (function (SpaceEnum) {
        SpaceEnum["Blank"] = ":ok_hand:";
        SpaceEnum["X"] = ":x:";
        SpaceEnum["O"] = ":o:";
    })(SpaceEnum = boardEnums.SpaceEnum || (boardEnums.SpaceEnum = {}));
    let CoordinateIndicators;
    (function (CoordinateIndicators) {
        CoordinateIndicators["A"] = ":regional_indicator_a:";
        CoordinateIndicators["B"] = ":regional_indicator_b:";
        CoordinateIndicators["C"] = ":regional_indicator_c:";
        CoordinateIndicators["One"] = ":one:";
        CoordinateIndicators["Two"] = ":two:";
        CoordinateIndicators["Three"] = ":three:";
        CoordinateIndicators["TopLeft"] = ":record_button:";
    })(CoordinateIndicators = boardEnums.CoordinateIndicators || (boardEnums.CoordinateIndicators = {}));
})(boardEnums = exports.boardEnums || (exports.boardEnums = {}));
class TTTBoard {
    constructor() {
        this.tiles = [
            [boardEnums.SpaceEnum.Blank, boardEnums.SpaceEnum.Blank, boardEnums.SpaceEnum.Blank],
            [boardEnums.SpaceEnum.Blank, boardEnums.SpaceEnum.Blank, boardEnums.SpaceEnum.Blank],
            [boardEnums.SpaceEnum.Blank, boardEnums.SpaceEnum.Blank, boardEnums.SpaceEnum.Blank]
        ];
    }
    ChangeTile(x, y, xo) {
        if (isNaN(x)) {
            return false;
        }
        if (isNaN(y)) {
            return false;
        }
        if (this.tiles[y][x] === boardEnums.SpaceEnum.Blank) {
            this.tiles[y][x] = xo;
            return true;
        }
        else {
            return false;
        }
    }
    CheckForWinner() {
        for (let index = 0; index < this.tiles.length; index++) {
            if (this.tiles[index][0] === this.tiles[index][1]
                && this.tiles[index][0] === this.tiles[index][2]
                && this.tiles[index][0] !== boardEnums.SpaceEnum.Blank) {
                return this.tiles[index][0];
            }
        }
        for (let index = 0; index < this.tiles[0].length; index++) {
            if (this.tiles[0][index] === this.tiles[1][index]
                && this.tiles[0][index] === this.tiles[2][index]
                && this.tiles[0][index] !== boardEnums.SpaceEnum.Blank) {
                return this.tiles[0][index];
            }
        }
        if (this.tiles[1][1] === this.tiles[0][0]
            && this.tiles[1][1] === this.tiles[2][2]
            && this.tiles[1][1] !== boardEnums.SpaceEnum.Blank) {
            return this.tiles[1][1];
        }
        if (this.tiles[1][1] === this.tiles[0][2]
            && this.tiles[1][1] === this.tiles[2][0]
            && this.tiles[1][1] !== boardEnums.SpaceEnum.Blank) {
            return this.tiles[1][1];
        }
        for (let y = 0; y < this.tiles.length; y++) {
            for (let x = 0; x < this.tiles[y].length; x++) {
                if (this.tiles[y][x] === boardEnums.SpaceEnum.Blank) {
                    return null;
                }
            }
        }
        return boardEnums.SpaceEnum.Blank;
    }
    GetBoardVisual() {
        let boardVisual = ` \n${boardEnums.CoordinateIndicators.TopLeft}|${boardEnums.CoordinateIndicators.A}|${boardEnums.CoordinateIndicators.B}|${boardEnums.CoordinateIndicators.C}|
        \n${boardEnums.CoordinateIndicators.One}|${this.tiles[0][0]}|${this.tiles[0][1]}|${this.tiles[0][2]}|
        \n${boardEnums.CoordinateIndicators.Two}|${this.tiles[1][0]}|${this.tiles[1][1]}|${this.tiles[1][2]}|
        \n${boardEnums.CoordinateIndicators.Three}|${this.tiles[2][0]}|${this.tiles[2][1]}|${this.tiles[2][2]}|`;
        return boardVisual;
    }
}
exports.TTTBoard = TTTBoard;
//# sourceMappingURL=ttt-board.js.map