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
                },
                {
                    name: 'amount',
                    description: 'Amount of entries to retrieve.',
                    expand: true,
                    required: false,
                    default: 1
                }
            ]
        });
    }
    execute(input) {
        let list = input.getArgument('list');
        let amount = input.getArgument('amount');
        let entries = list.split(/\s*,+\s*/);
        let elements = [];
        if (amount > 0) {
            for (let i = 0; i < amount; i++) {
                elements[i] = entries[Math.floor(Math.random() * entries.length)];
            }
            input.channel.send(elements.join(', '));
        }
    }
}
exports.CSV = CSV;
//# sourceMappingURL=csv.js.map