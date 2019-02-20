import { Command, Input } from '@api';
import { GuildMember } from 'discord.js';

export class Level extends Command {
    constructor() {
        super({
            name: 'level',
            description: 'Returns the current level and experience of the specified user.',
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
