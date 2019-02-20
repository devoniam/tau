import { Command, Input } from '@api';

export class Uptime extends Command {
    constructor() {
        super({
            name: 'uptime',
            description: 'Returns how long the bot has been online and running.',
        });
    }

    execute(input: Input) {
        input.channel.send('Not yet implemented.');
    }
}
