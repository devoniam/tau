import { Command, Input } from '@api';

export class InspirationalQuote extends Command {
    constructor() {
        super({
            name: 'inspiration',
            aliases: ['inspire', 'inspirational'],
            description: 'Returns a random inspirational quote.'
        });
    }

    execute(input: Input) {
        input.channel.send('Not yet implemented.');
    }
}
