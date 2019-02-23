"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const ttt_lobby_manager_1 = require("@bot/libraries/tictactoe/ttt-lobby-manager");
class TicTacToe extends _api_1.Command {
    constructor() {
        super({
            name: 'tictactoe',
            aliases: ['tic', 'ttt'],
            description: 'Play a game of tic tac toe with another user.',
            arguments: [
                {
                    name: 'action',
                    required: true,
                    options: ['start', 'join']
                },
                {
                    name: 'options',
                    required: false,
                    expand: true
                }
            ]
        });
        this.tttLobbyManager = new ttt_lobby_manager_1.TTTLobbyManager();
    }
    execute(input) {
        let action = input.getArgument('action');
        let options = input.getArgument('options');
        if (action == 'start') {
            this.start(input, options);
        }
        else {
            this.join(input, options);
        }
    }
    start(input, options) {
        input.channel.send("Opening tic tac toe lobby in this chat.");
        let indexOfNewLobby = this.tttLobbyManager.AddLobby(input.guild, input.channel, input.member);
        input.channel.send(this.tttLobbyManager.GetLobby(indexOfNewLobby).GetPlayer(1) + " has been added to new lobby #" + indexOfNewLobby);
    }
    join(input, options) {
        let lobbiesInServer = this.tttLobbyManager.GetLobbiesInChannel(input.guild, input.channel);
        let message = "Lobbies:";
        this.displayAllLobbies(lobbiesInServer, message, input);
        const filter = (number) => !isNaN(number)
            && this.numberIsValidLobby(number, lobbiesInServer)
            && this.isLobbyOpen(lobbiesInServer, number)
            && this.isAlreadyInLobby(lobbiesInServer, number, input.member);
        const collector = input.channel.createMessageCollector(filter);
        let self = this;
        collector.once('collect', function (number) {
            lobbiesInServer[number].AddPlayer(input.member);
            let lobbyIndex = self.tttLobbyManager.FindLobby(lobbiesInServer[number]);
            if (typeof lobbyIndex === "number") {
                self.tttLobbyManager.BeginGameInLobby(lobbyIndex);
            }
        });
    }
    isAlreadyInLobby(lobbiesInServer, number, member) {
        return lobbiesInServer[number].GetPlayer(1) !== member && lobbiesInServer[number].GetPlayer(2) !== member;
    }
    isLobbyOpen(lobbiesInServer, number) {
        return lobbiesInServer[number].GetPlayer(1) === null || lobbiesInServer[number].GetPlayer(2) === null;
    }
    numberIsValidLobby(lobbyNumber, lobbiesInServer) {
        return lobbyNumber >= 0 && lobbyNumber < lobbiesInServer.length;
    }
    displayAllLobbies(lobbiesInServer, message, input) {
        for (let index = 0; index < lobbiesInServer.length; index++) {
            let currentLobby = lobbiesInServer[index];
            message += "\n  ";
            message += "[" + index + "] - ";
            if (currentLobby.GetPlayer(1) === null && currentLobby.GetPlayer(2) === null) {
                message += "empty";
            }
            if (currentLobby.GetPlayer(1) !== null) {
                message += this.addPlayerNameToMessage(currentLobby.GetPlayer(1));
            }
            if (currentLobby.GetPlayer(2) !== null) {
                message += this.addPlayerNameToMessage((currentLobby.GetPlayer(2)));
            }
        }
        input.channel.send("```" + message + "```");
        input.channel.send("Select the lobby you wish to join");
    }
    addPlayerNameToMessage(player) {
        let message = "";
        message += player.displayName + " ";
        return message;
    }
}
exports.TicTacToe = TicTacToe;
//# sourceMappingURL=tictactoe.js.map