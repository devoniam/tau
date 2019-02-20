import { Command, Input } from '@api';

export class Between extends Command {
    constructor() {
        super({
            name: 'between',
            description: 'Generates a random number between `x` and `y`.',
            arguments: [
                {
                    name: 'x',
                    description: 'The minimum value.',
                    constraint: 'number',
                    required: true
                },
                {
                    name: 'y',
                    description: 'The maximum value.',
                    constraint: 'number',
                    required: true
                }
            ]
        });
    }

    execute(input: Input) {
        let x = input.getArgument('x') as number;
        let y = input.getArgument('y') as number;

        input.channel.send('Not yet implemented.');
    }
}
