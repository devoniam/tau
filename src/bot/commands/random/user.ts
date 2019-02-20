import { Command, Input } from '@api';
import { Role } from 'discord.js';

export class User extends Command {
    constructor() {
        super({
            name: 'user',
            aliases: ['randomuser', 'users', 'randomusers', 'randuser', 'randusers'],
            description: 'Picks one or more random users in the guild, optionally by role.',
            arguments: [
                {
                    name: 'role',
                    description: 'An optional role to limit results to.',
                    constraint: 'role',
                    error: true
                },
                {
                    name: 'amount',
                    description: 'The number of users to pick (limit: 20).',
                    constraint: 'number',
                    default: 1,
                    error: true,
                    eval: (input : number) => input >= 1 && input <= 20
                }
            ]
        });
    }

    execute(input: Input) {
        let role = input.getArgument('role') as Role | undefined;
        let amount = input.getArgument('amount') as number;

        input.channel.send('Not yet implemented.');
    }
}
