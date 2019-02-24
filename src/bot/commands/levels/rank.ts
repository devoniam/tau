import { Command, Input } from '@api';
import { GuildMember } from 'discord.js';
import { Experience } from '@bot/libraries/experience';

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

    async execute(input: Input) {
        let user = input.getArgument('user') as GuildMember;
        let rank = await Experience.getRank(user);

        input.channel.send(`:sparkles:  ${user} is rank **#${rank}**.`);
    }
}
