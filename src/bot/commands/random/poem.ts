import { Command, Input } from '@api';

const poems = readPublicFile('random/poems.txt').split(/\r?\n\r?\n/);

export class Poem extends Command {
    constructor() {
        super({
            name: 'poem',
            description: 'Returns a random poem.'
        });
    }

    async execute(input: Input) {
        let index = _.random(0, poems.length - 1);
        let line = poems[index];

        await input.channel.send({
            embed:
            {
                color: 3447003,
                title: `**Poem** (#${1 + index})`,
                description: line
            }
        });
    }
}
