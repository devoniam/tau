import { Command, Input } from '@api';
import { GuildMember } from 'discord.js';
import { Experience } from '@bot/libraries/experience';

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

    async execute(input: Input) {
        let user = input.getArgument('user') as GuildMember;
        let goal = await Experience.getExperienceGoal(user) - user.settings.experience;

        input.channel.send(`:sparkles:  ${user} is level **${user.settings.level}** and needs **${goal}** more points to level up.`);
    }
}
