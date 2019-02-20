"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class CSV extends _api_1.Command {
    constructor() {
        super({
            name: 'csv',
            aliases: ['pick', 'choose'],
            description: 'Picks one or more random entries from the given comma-separated list.',
            arguments: [
                {
                    name: 'list',
                    description: 'List of entries separated by commas.',
                    expand: true,
                    required: true,
                    eval: (input) => input.indexOf(',') > 0
                }
            ]
        });
    }
    execute(input) {
        let list = input.getArgument('list');
        let entries = list.split(/,+/);
        input.channel.send('Not yet implemented.');
    }
}
exports.CSV = CSV;
//# sourceMappingURL=csv.js.map