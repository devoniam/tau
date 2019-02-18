import { Command, Input } from '@api';

export class Help extends Command {
    constructor() {
        super({
            name: 'help',
            description: 'Shows a list of commands.',
            arguments: [
                {
                    name: 'destination',
                    description: 'Where to post the help commands.',
                    options: ['here', 'dm'],
                    default: 'dm'
                }
            ]
        });
    }

    execute(input: Input) {
        let destination = input.getArgument('destination');
        input.channel.send('List commands ' + (destination == 'here' ? 'here' : 'in a message') + '...');
    }
}
