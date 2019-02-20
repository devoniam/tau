"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Nicknames extends _api_1.Command {
    constructor() {
        super({
            name: 'nicknames',
            description: 'Returns the nickname history for the specified user.',
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
exports.Nicknames = Nicknames;
//# sourceMappingURL=nicknames.js.map