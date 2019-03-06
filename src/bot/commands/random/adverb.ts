import { Command, Input } from '@api';

const adverbs = readPublicFile('random/adverbs.txt').split(/\r?\n/);

export class Adverb extends Command {
    constructor() {
        super({
            name: 'adverb',
            description: 'Displays a random adverb.'
        });
    }

    execute(input: Input) {
        let rnd = Math.floor(Math.random() * adverbs.length);

        input.channel.send({
            embed:
            {
                color: 3447003,
                title: `**Adverb** (#${1 + rnd})`,
                description: adverbs[rnd]
            }
        });
    }
}
