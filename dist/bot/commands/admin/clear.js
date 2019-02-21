"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Clear extends _api_1.Command {
    constructor() {
        super({
            name: 'clear',
            description: 'Clears messages from the current channel.',
            arguments: [
                {
                    name: 'amount',
                    description: 'The number of messages to clear.',
                    patterns: /(\d+|all)/,
                    required: true,
                    usage: 'amount|all',
                    eval: (input) => input.toLowerCase() == 'all' || (parseInt(input) > 0 && parseInt(input) < 200)
                }
            ]
        });
    }
    execute(input) {
        let amount = input.getArgument('amount');
        input.channel.send('Not yet implemented.');
    }
}
exports.Clear = Clear;
//# sourceMappingURL=clear.js.map