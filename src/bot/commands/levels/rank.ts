import { Command, Input } from '@api';
import { GuildMember } from 'discord.js';

export class Rank extends Command {
    constructor() {
        super({
            name: 'rank',
            description: 'Returns the current rank of the specified user.',
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
