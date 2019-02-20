import { Command, Input } from '@api';

export class Help extends Command {
    constructor() {
        super({
            name: 'help',
            description: 'Returns a list of commands.',
            arguments: [
                {
                    name: 'name',
                    description: 'The name of the command to see more details about.'
                }
            ]
        });
    }

    execute(input: Input) {
        let name = input.getArgument('name');

        if (name) {

        }
    }
}
