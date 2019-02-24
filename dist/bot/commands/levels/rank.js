"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const experience_1 = require("@bot/libraries/experience");
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
    async execute(input) {
        let user = input.getArgument('user');
        let rank = await experience_1.Experience.getRank(user);
        input.channel.send(`:sparkles:  ${user} is rank **#${rank}**.`);
    }
}
exports.Rank = Rank;
//# sourceMappingURL=rank.js.map