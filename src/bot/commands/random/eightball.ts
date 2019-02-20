import { Command, Input } from '@api';

export class EightBall extends Command {
    constructor() {
        super({
            name: 'eightball',
            aliases: ['8ball', '8', 'eight', 'ask'],
            description: 'Ask the eight ball a question.',
            arguments: [
                {
                    name: 'question',
                    description: 'The question to ask.',
                    expand: true,
                    required: true
                }
            ]
        });
    }

    execute(input: Input) {
        input.channel.send('Not yet implemented.');
    }
}
