import { Command, Input } from '@api';

export class Redeem extends Command {
    constructor() {
        super({
            name: 'redeem',
            aliases: ['daily'],
            description: 'Redeems a random amount of daily currency.',
        });
    }

    execute(input: Input) {
        input.channel.send('Not yet implemented.');
    }
}
