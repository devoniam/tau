"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Spam extends _api_1.Command {
    constructor() {
        super({
            name: 'spam',
            description: 'The only thing I can say to describe this is: 😱',
            arguments: [
                {
                    name: 'user',
                    description: 'The poor soul who shall be flooded with messages.',
                    constraint: 'mention',
                    required: true
                },
                {
                    name: 'amount',
                    description: 'The number of messages to send (1 – 100).',
                    constraint: 'number',
                    required: true,
                    eval: (input) => input > 0 && input < 100
                },
                {
                    name: 'delay',
                    description: 'The delay between messages in seconds (minimum 5).',
                    constraint: 'number',
                    required: true,
                    eval: (input) => input >= 5
                }
            ]
        });
    }
    execute(input) {
        let user = input.getArgument('user');
        let amount = input.getArgument('amount');
        let delay = input.getArgument('delay');
        input.channel.send('Not yet implemented.');
    }
}
exports.Spam = Spam;
//# sourceMappingURL=spam.js.map