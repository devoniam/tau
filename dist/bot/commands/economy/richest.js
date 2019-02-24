"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const economy_1 = require("@bot/libraries/economy");
const Table = require('easy-utf8-table');
class Richest extends _api_1.Command {
    constructor() {
        super({
            name: 'richest',
            description: 'Returns a list of the top richest members of the server.',
            arguments: [
                {
                    name: 'limit',
                    description: 'The maximum number of entries to display.',
                    constraint: 'number',
                    default: 10,
                    error: true,
                    eval: (input) => input >= 5 && input <= 25
                }
            ]
        });
    }
    async execute(input) {
        let limit = input.getArgument('limit');
        let rows = await economy_1.Economy.getAllBalances(input.guild);
        let display = _.slice(rows, 0, limit);
        let table = new Table();
        display.forEach((row, i) => {
            table.cell('#', i + 1);
            table.cell('Member', row.member.displayName);
            table.cell('Balance', `$${row.balance.toFixed(2)}`);
            table.newRow();
        });
        input.channel.send('```\n' + table + '\n```');
    }
}
exports.Richest = Richest;
//# sourceMappingURL=richest.js.map