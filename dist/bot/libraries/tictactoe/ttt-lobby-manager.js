"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ttt_lobby_1 = require("@bot/libraries/tictactoe/ttt-lobby");
class TTTLobbyManager {
    constructor(lobbies = []) {
        this.lobbies = lobbies;
    }
    AddLobby(server, channel, player) {
        this.lobbies.push(new ttt_lobby_1.TTTLobby(server, channel, player, null));
        return this.lobbies.length - 1;
    }
    BeginGameInLobby(lobbyIndex) {
        if (this.lobbies[lobbyIndex].GetPlayer(1) !== null && this.lobbies[lobbyIndex].GetPlayer(2) !== null) {
            this.lobbies[lobbyIndex].BeginTheGame();
        }
    }
    FindLobby(lobby) {
        for (let index = 0; index < this.lobbies.length; index++) {
            if (lobby === this.lobbies[index]) {
                return index;
            }
        }
        return undefined;
    }
    GetLobby(lobbyIndex) {
        return this.lobbies[lobbyIndex];
    }
    GetLobbies() {
        return this.lobbies;
    }
    GetLobbiesInChannel(server, channel) {
        let lobbiesInServer = [];
        for (let index = 0; index < this.lobbies.length; index++) {
            if (server.id === this.lobbies[index].GetLobbyServer().id
                && channel.id === this.lobbies[index].GetLobbyChannel().id) {
                lobbiesInServer.push(this.lobbies[index]);
            }
            else {
            }
        }
        return lobbiesInServer;
    }
    GetNumLobbies() {
        return this.lobbies.length;
    }
    RemoveLobby(lobbyIndex) {
        this.lobbies.splice(lobbyIndex);
    }
}
exports.TTTLobbyManager = TTTLobbyManager;
//# sourceMappingURL=ttt-lobby-manager.js.map