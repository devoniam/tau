"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Help extends _api_1.Command {
    constructor() {
        super({
            name: 'help',
            description: 'Shows a list of commands.',
            arguments: [
                {
                    name: 'destination',
                    description: 'Where to post the help commands.',
                    options: ['here', 'dm'],
                    default: 'dm'
                }
            ]
        });
    }
    execute(input) {
        let destination = input.getArgument('destination');
        input.channel.send('List commands ' + (destination == 'here' ? 'here' : 'in a message') + '...');
    }
}
exports.Help = Help;
