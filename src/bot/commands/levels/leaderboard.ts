import { Command, Input } from '@api';

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

    execute(input: Input) {
        let limit = input.getArgument('limit') as number;

        input.channel.send('Not yet implemented.');
    }
}
