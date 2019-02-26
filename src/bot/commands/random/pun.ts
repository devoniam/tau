import { Command, Input } from '@api';

export class Pun extends Command {
    constructor() {
        super({
            name: 'pun',
            description: 'Returns a random pun.'
        });
    }

    execute(input: Input) {
        input.channel.send('Not yet implemented.');
    }
}
