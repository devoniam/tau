"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
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
    }
    execute(input) {
        let action = input.getArgument('action');
        let options = input.getArgument('options');
        input.channel.send('Not yet implemented.');
    }
}
exports.TicTacToe = TicTacToe;
//# sourceMappingURL=tictactoe.js.map