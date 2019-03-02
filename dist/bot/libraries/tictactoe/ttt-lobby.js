"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ttt_board_1 = require("@bot/libraries/tictactoe/ttt-board");
const CenterX = 1;
const CenterY = 1;
var tttEnums;
(function (tttEnums) {
    let TurnEnum;
    (function (TurnEnum) {
        TurnEnum[TurnEnum["Searching"] = 0] = "Searching";
        TurnEnum[TurnEnum["Player1"] = 1] = "Player1";
        TurnEnum[TurnEnum["Player2"] = 2] = "Player2";
        TurnEnum[TurnEnum["Complete"] = 3] = "Complete";
    })(TurnEnum = tttEnums.TurnEnum || (tttEnums.TurnEnum = {}));
    let rowColumnEnum;
    (function (rowColumnEnum) {
        rowColumnEnum[rowColumnEnum["A"] = 1] = "A";
        rowColumnEnum[rowColumnEnum["B"] = 2] = "B";
        rowColumnEnum[rowColumnEnum["C"] = 3] = "C";
    })(rowColumnEnum = tttEnums.rowColumnEnum || (tttEnums.rowColumnEnum = {}));
})(tttEnums || (tttEnums = {}));
class TTTLobby {
    constructor(server, channel, manager, player1 = null, player2 = null) {
        this.currentTurn = tttEnums.TurnEnum.Searching;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new ttt_board_1.TTTBoard();
        this.player1Space = ttt_board_1.boardEnums.SpaceEnum.X;
        this.player2Space = ttt_board_1.boardEnums.SpaceEnum.O;
        this.boardMessage = null;
        this.turnMessage = null;
        this.lobbyChannel = channel;
        this.lobbyServer = server;
        this.lobbyManager = manager;
        this.rowString = `${tttEnums.rowColumnEnum[tttEnums.rowColumnEnum.A]}`
            + `${tttEnums.rowColumnEnum[tttEnums.rowColumnEnum.B]}`
            + `${tttEnums.rowColumnEnum[tttEnums.rowColumnEnum.C]}`;
        this.colString = `${tttEnums.rowColumnEnum.A}`
            + `${tttEnums.rowColumnEnum.B}`
            + `${tttEnums.rowColumnEnum.C}`;
    }
    AddPlayer(player) {
        if (this.player1 === null) {
            this.player1 = player;
        }
        else if (this.player2 === null) {
            this.player2 = player;
        }
        else {
            return "Lobby is full.";
        }
        return "Successfully added player";
    }
    BeginTheGame() {
        this.currentTurn = _.random(tttEnums.TurnEnum.Player1, tttEnums.TurnEnum.Player2);
        this.GameLoop();
    }
    BeginNewTurn() {
        if (this.boardMessage === null) {
            this.lobbyChannel.send(this.board.GetBoardVisual()).then((msg) => {
                this.boardMessage = msg;
            });
        }
        else {
            this.boardMessage.edit(this.board.GetBoardVisual());
        }
        let playerWithTurn = this.GetPlayerWithTurn();
        let playerSpaceIcon = this.GetPlayerWithTurnSpaceIcon();
        if (playerWithTurn) {
            let turnMsgText = `\n${playerWithTurn.displayName}'s turn`;
            if (this.turnMessage === null) {
                this.lobbyChannel.send(turnMsgText).then((msg) => {
                    this.turnMessage = msg;
                });
            }
            else {
                this.turnMessage.edit(turnMsgText);
            }
        }
        return { playerWithTurn, playerSpaceIcon };
    }
    GameLoop() {
        let { playerWithTurn, playerSpaceIcon } = this.BeginNewTurn();
        let doReturn = this.IsGameOver();
        if (doReturn) {
            if (this.turnMessage) {
                this.turnMessage.delete();
            }
            this.lobbyManager.FindAndRemoveLobby(this);
            return;
        }
        let coordinateRegex = new RegExp('([' + this.rowString + this.colString + '])', 'gi');
        const filter = (message) => message.member === playerWithTurn
            && coordinateRegex.test(message.content);
        const collector = this.lobbyChannel.createMessageCollector(filter);
        let successfullyChangedTile = false;
        let self = this;
        collector.once('collect', function (message) {
            let verticalInput = self.GetInput(self, message, new RegExp('([' + self.colString + '])', 'i'));
            let horizontalInput = self.GetInput(self, message, new RegExp('([' + self.rowString + '])', 'i'));
            let x = 1;
            let y = 1;
            if (verticalInput !== null && !isNaN(Number(verticalInput))) {
                y = Number(verticalInput) - 1;
            }
            if (horizontalInput !== null) {
                if (horizontalInput.toUpperCase() === "A") {
                    x = tttEnums.rowColumnEnum.A - 1;
                }
                else if (horizontalInput.toUpperCase() === "B") {
                    x = tttEnums.rowColumnEnum.B - 1;
                }
                else if (horizontalInput.toUpperCase() === "C") {
                    x = tttEnums.rowColumnEnum.C - 1;
                }
            }
            message.delete();
            successfullyChangedTile = self.board.ChangeTile(x, y, playerSpaceIcon);
            if (successfullyChangedTile) {
                self.currentTurn = (self.currentTurn === tttEnums.TurnEnum.Player1
                    ? tttEnums.TurnEnum.Player2 : tttEnums.TurnEnum.Player1);
            }
            self.GameLoop();
        });
    }
    GetInput(self, message, regexp) {
        let input = null;
        if (regexp.test(message.content)) {
            let match = message.content.match(regexp);
            if (match) {
                input = String(match[0]);
            }
        }
        return input;
    }
    GetLobbyChannel() {
        return this.lobbyChannel;
    }
    GetLobbyServer() {
        return this.lobbyServer;
    }
    GetPlayer(playerNumber) {
        if (playerNumber === 1) {
            return this.player1;
        }
        if (playerNumber === 2) {
            return this.player2;
        }
        return null;
    }
    GetPlayerWithTurn() {
        let playerWithTurn = null;
        if (this.currentTurn === tttEnums.TurnEnum.Player1) {
            playerWithTurn = this.player1;
        }
        else {
            playerWithTurn = this.player2;
        }
        return playerWithTurn;
    }
    GetPlayerWithTurnSpaceIcon() {
        let xo;
        if (this.currentTurn === tttEnums.TurnEnum.Player1) {
            xo = this.player1Space;
        }
        else if (this.currentTurn === tttEnums.TurnEnum.Player2) {
            xo = this.player2Space;
        }
        return xo;
    }
    IsGameOver() {
        let winner = this.board.CheckForWinner();
        if (winner === this.player1Space) {
            this.lobbyChannel.send(`${this.player1} wins`);
            return true;
        }
        if (winner === this.player2Space) {
            this.lobbyChannel.send(`${this.player2} wins`);
            return true;
        }
        if (winner !== null) {
            this.lobbyChannel.send(`A tie, as per usual`);
            return true;
        }
        return false;
    }
}
exports.TTTLobby = TTTLobby;
//# sourceMappingURL=ttt-lobby.js.map