"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Level extends _api_1.Command {
    constructor() {
        super({
            name: 'level',
            description: 'Returns the current level and experience of the specified user.',
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
exports.Level = Level;
//# sourceMappingURL=level.js.map