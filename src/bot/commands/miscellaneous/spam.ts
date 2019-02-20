import { Command, Input } from '@api';
import { GuildMember } from 'discord.js';

export class Spam extends Command {
    constructor() {
        super({
            name: 'spam',
            description: 'The only thing I can say to describe this is: 😱',
            arguments: [
                {
                    name: 'user',
                    description: 'The poor soul who shall be flooded with messages.',
                    constraint: 'mention',
                    required: true
                },
                {
                    name: 'amount',
                    description: 'The number of messages to send (1 – 100).',
                    constraint: 'number',
                    required: true,
                    eval: (input: number) => input > 0 && input < 100
                },
                {
                    name: 'delay',
                    description: 'The delay between messages in seconds (minimum 5).',
                    constraint: 'number',
                    required: true,
                    eval: (input: number) => input >= 5
                }
            ]
        });
    }

    execute(input: Input) {
        let user = input.getArgument('user') as GuildMember;
        let amount = input.getArgument('amount') as number;
        let delay = input.getArgument('delay') as number;

        // Note: I changed delay to be in seconds (for consistent user experience), so make that work pls.

        input.channel.send('Not yet implemented.');
    }
}
