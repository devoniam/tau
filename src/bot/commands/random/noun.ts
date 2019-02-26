import { Command, Input } from '@api';

export class Noun extends Command {
    constructor() {
        super({
            name: 'noun',
            description: 'Returns a random noun.'
        });
    }

    execute(input: Input) {
        input.channel.send('Not yet implemented.');
    }
}
