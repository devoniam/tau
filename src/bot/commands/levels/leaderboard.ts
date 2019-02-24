import { Command, Input } from '@api';
import { Experience } from '@bot/libraries/experience';
const Table = require('easy-utf8-table');

export class Leaderboard extends Command {
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
                    eval: (input: number) => input >= 5 && input <= 25
                }
            ]
        });
    }

    async execute(input: Input) {
        let limit = input.getArgument('limit') as number;
        let rows = await Experience.getAllLevels(input.guild);
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
