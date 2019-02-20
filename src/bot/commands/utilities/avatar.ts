import { Command, Input } from '@api';
import { GuildMember } from 'discord.js';

export class Avatar extends Command {
    constructor() {
        super({
            name: 'avatar',
            description: 'Returns the full avatar for the specified user.',
            arguments: [
                {
                    name: 'user',
                    constraint: 'mention',
                    default: '@member',
                    error: true
                }
            ]
        });
    }

    execute(input: Input) {
        let user = input.getArgument('user') as GuildMember;

        input.channel.send('Not yet implemented.');
    }
}
