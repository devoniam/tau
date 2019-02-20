import { Command, Input } from '@api';

export class Match extends Command {
    constructor() {
        super({
            name: 'match',
            description: 'Searches the internet for the given link and finds prices on various marketplaces.',
            arguments: [
                {
                    name: 'url',
                    description: 'A link to the item of interest.',
                    constraint: 'url',
                    required: true
                }
            ]
        });
    }

    execute(input: Input) {
        let url = input.getArgument('url') as string;

        input.channel.send('Not yet implemented.');
    }
}
