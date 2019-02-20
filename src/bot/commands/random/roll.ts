import { Command, Input } from '@api';

export class Roll extends Command {
    constructor() {
        super({
            name: 'roll',
            description: 'Rolls one or more dice and returns the result.',
            arguments: [
                {
                    name: 'dice',
                    description: 'The number of dice to roll.',
                    constraint: 'number',
                    default: 1,
                    eval: (input: number) => input >= 1 && input <= 10
                }
            ]
        });
    }

    execute(input: Input) {
        let dice = input.getArgument('dice') as number;

        input.channel.send('Not yet implemented.');
    }
}
