import { Command, Input } from '@api';
import { GuildMember } from 'discord.js';

export class Mock extends Command {
    constructor() {
        super({
            name: 'mock',
            description: 'Returns text mocking the target user\'s last message in the channel.',
            arguments: [
                {
                    name: 'user',
                    constraint: 'mention',
                    required: true
                }
            ]
        });
    }

    execute(input: Input) {
        let user = input.getArgument('user') as GuildMember;
        let lastMessage = user.lastMessage;
        let lastMessageText = lastMessage.content;

        input.channel.send('Not yet implemented.');
    }
}
