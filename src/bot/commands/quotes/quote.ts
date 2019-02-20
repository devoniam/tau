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
                    usage: 'add|remove|get',
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

        // If they pass a mention in as the first argument, action will be a guildmember object.
        // In this case, we'll set the user to that object, and override action to be 'get'.
        // This is only temporary, tbh, until the framework can infer user intention in optional arguments (wip).
        // If no arguments are passed, action will be 'get'.

        if (typeof action != 'string') {
            user = <GuildMember> action;
            action = 'get';
        }

        input.channel.send('Not yet implemented.');
    }
}
