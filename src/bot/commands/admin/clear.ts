import { Command, Input } from '@api';

export class Clear extends Command {
    constructor() {
        super({
            name: 'clear',
            description: 'Clears messages from the current channel.',
            arguments: [
                {
                    name: 'amount',
                    description: 'The number of messages to clear.',
                    pattern: /(\d+|all)/,
                    required: true,
                    usage: 'amount|all',
                    eval: (input: string) => input.toLowerCase() == 'all' || (parseInt(input) > 0 && parseInt(input) < 200)
                }
            ]
        });
    }

    execute(input: Input) {
        let amount = input.getArgument('amount') as string;

        input.channel.send('Not yet implemented.');
    }
}
