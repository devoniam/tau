"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Quote extends _api_1.Command {
    constructor() {
        super({
            name: 'quote',
            description: 'Manages saved quotes for the server.',
            arguments: [
                {
                    name: 'action',
                    usage: 'add|remove|get',
                    default: 'get'
                },
                {
                    name: 'user',
                    constraint: 'mention',
                    error: true
                }
            ]
        });
    }
    execute(input) {
        let action = input.getArgument('action');
        let user = input.getArgument('user');
        if (typeof action != 'string') {
            user = action;
            action = 'get';
        }
        input.channel.send('Not yet implemented.');
    }
}
exports.Quote = Quote;
//# sourceMappingURL=quote.js.map