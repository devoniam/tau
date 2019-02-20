import { Command, Input } from '@api';

export class Ping extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Returns the bot\'s current latency.'
        });
    }

    execute(input: Input) {
        input.channel.send('Not yet implemented.');
    }
}
