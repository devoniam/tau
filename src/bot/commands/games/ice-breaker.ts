import { Command, Input } from '@api';

export class IceBreaker extends Command {
    constructor() {
        super({
            name: 'breakice',
            description: 'Returns a random question to spark a conversation.'
        });
    }

    execute(input: Input) {
        input.channel.send('Not yet implemented.');
    }
}
