"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class EightBall extends _api_1.Command {
    constructor() {
        super({
            name: 'eightball',
            aliases: ['8ball', '8', 'eight', 'ask'],
            description: 'Ask the eight ball a question.',
            arguments: [
                {
                    name: 'question',
                    description: 'The question to ask.',
                    expand: true,
                    required: true
                }
            ]
        });
    }
    execute(input) {
        input.channel.send('Not yet implemented.');
    }
}
exports.EightBall = EightBall;
