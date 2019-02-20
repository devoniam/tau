import { Command, Input } from '@api';

export class Verb extends Command {
    constructor() {
        super({
            name: 'verb',
            description: 'Returns a random verb.'
        });
    }

    execute(input: Input) {
        input.channel.send('Not yet implemented.');
    }
}
