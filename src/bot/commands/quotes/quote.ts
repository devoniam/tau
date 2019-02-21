import { Command, Input } from '@api';
import { GuildMember } from 'discord.js';

export class Quote extends Command {
    constructor() {
        super({
            name: 'quote',
            description: 'Manages saved quotes for the server.',
            arguments: [
                {
                    name: 'action',
                    options: ['add', 'remove', 'get'],
                    default: 'get'
                },
                {
                    name: 'user',
                    constraint: 'mention',
                    error: true
                }
            ]
        });
    }

    execute(input: Input) {
        let action = input.getArgument('action') as string | GuildMember;
        let user = input.getArgument('user') as GuildMember;

        input.channel.send('Not yet implemented.');
    }
}
