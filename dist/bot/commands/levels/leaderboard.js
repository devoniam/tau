"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Leaderboard extends _api_1.Command {
    constructor() {
        super({
            name: 'leaderboard',
            aliases: ['top'],
            description: 'Returns a list of the top leveled members of the server.',
            arguments: [
                {
                    name: 'limit',
                    description: 'The maximum number of entries to display.',
                    constraint: 'number',
                    default: 10,
                    error: true,
                    eval: (input) => input >= 5 && input <= 25
                }
            ]
        });
    }
    execute(input) {
        let limit = input.getArgument('limit');
        input.channel.send('Not yet implemented.');
    }
}
exports.Leaderboard = Leaderboard;
//# sourceMappingURL=leaderboard.js.map