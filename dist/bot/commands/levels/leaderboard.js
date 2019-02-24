"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const experience_1 = require("@bot/libraries/experience");
const Table = require('easy-utf8-table');
class Leaderboard extends _api_1.Command {
    constructor() {
        super({
            name: 'leaderboard',
            aliases: ['top'],
            description: 'Returns a list of the top leveled members of the server.',
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
        let rows = await experience_1.Experience.getAllLevels(input.guild);
        let display = _.slice(rows, 0, limit);
        let table = new Table();
        display.forEach(row => {
            table.cell('#', row.rank);
            table.cell('Member', row.member.displayName);
            table.cell('Level', row.level);
            table.cell('Experience', row.experience);
            table.cell('Next level in', row.experienceGoal - row.experience);
            table.newRow();
        });
        input.channel.send('```\n' + table + '\n```');
    }
}
exports.Leaderboard = Leaderboard;
//# sourceMappingURL=leaderboard.js.map