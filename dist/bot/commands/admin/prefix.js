"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Prefix extends _api_1.Command {
    constructor() {
        super({
            name: 'prefix',
            description: 'Changes the prefix for the bot for a server.',
            arguments: [
                {
                    name: 'char',
                    description: 'A new single character to use as the prefix.',
                    options: ['!', '@', '#', '$', '%', '^', '&', '*', '<', '>', ',', '.', '/', '?', ':', ';', '|', '~', '`', '=', '+', '-'],
                    usage: 'character',
                    required: true
                }
            ]
        });
    }
    execute(input) {
        let char = input.getArgument('char');
        input.channel.send('Not yet implemented.');
    }
}
exports.Prefix = Prefix;
//# sourceMappingURL=prefix.js.map