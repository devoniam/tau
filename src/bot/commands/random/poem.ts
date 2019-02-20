import { Command, Input } from '@api';

export class Poem extends Command {
    constructor() {
        super({
            name: 'poem',
            description: 'Returns a random poem.'
        });
    }

    execute(input: Input) {
        input.channel.send('Not yet implemented.');
    }
}
