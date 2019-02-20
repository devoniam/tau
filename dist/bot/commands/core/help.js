"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Help extends _api_1.Command {
    constructor() {
        super({
            name: 'help',
            description: 'Returns a list of commands.',
            arguments: [
                {
                    name: 'name',
                    description: 'The name of the command to see more details about.'
                }
            ]
        });
    }
    execute(input) {
        let name = input.getArgument('name');
        if (name) {
        }
    }
}
exports.Help = Help;
