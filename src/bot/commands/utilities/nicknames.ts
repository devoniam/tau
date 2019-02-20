import { Command, Input } from '@api';
import { GuildMember } from 'discord.js';

export class Nicknames extends Command {
    constructor() {
        super({
            name: 'nicknames',
            description: 'Returns the nickname history for the specified user.',
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
