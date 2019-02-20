"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Rank extends _api_1.Command {
    constructor() {
        super({
            name: 'rank',
            description: 'Returns the current rank of the specified user.',
            arguments: [
                {
                    name: 'user',
                    constraint: 'mention',
                    default: '@member',
                    error: true
                }
            ]
        });
    }
    execute(input) {
        let user = input.getArgument('user');
        input.channel.send('Not yet implemented.');
    }
}
exports.Rank = Rank;
