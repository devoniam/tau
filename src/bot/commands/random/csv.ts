import { Command, Input } from '@api';

export class CSV extends Command {
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
                    eval: (input : string) => input.indexOf(',') > 0
                }
            ]
        });
    }

    execute(input: Input) {
        let list = input.getArgument('list') as string;
        let entries = list.split(/\s*,\s*/);

        input.channel.send('Not yet implemented.');
    }
}
