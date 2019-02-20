import { Command, Input } from '@api';

export class Prefix extends Command {
    constructor() {
        super({
            name: 'prefix',
            description: 'Changes the prefix for the bot for a server.',
            arguments: [
                {
                    name: 'char',
                    description: 'A new single character to use as the prefix.',
                    options: ['!', '@', '#', '$', '%', '^', '&', '*', '<', '>', ',', '.', '/', '?', ':', ';', '|', '~', '`', '=', '+', '-'],
                    usage: 'character',
                    required: true
                }
            ]
        });
    }

    execute(input: Input) {
        let char = input.getArgument('char') as string;

        input.channel.send('Not yet implemented.');
    }
}
