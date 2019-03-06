import { Command, Input } from '@api';

const iceBreakerLines = readPublicFile('random/icebreakers.txt').split(/\r?\n/);

export class IceBreaker extends Command {
    constructor() {
        super({
            name: 'breakice',
            description: 'Returns a random question to spark a conversation.'
        });
    }

    async execute(input: Input) {
        let index = _.random(0, iceBreakerLines.length - 1);
        let line = iceBreakerLines[index];

        await input.channel.send({
            embed:
            {
                color: 3447003,
                title: `**Ice Breaker** (#${1 + index})`,
                description: line
            }
        });
    }
}
