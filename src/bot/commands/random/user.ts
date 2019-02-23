import { Command, Input } from '@api';
import { Role } from 'discord.js';


let callLimit = 10;
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
                    eval: (input: number) => {
                        if (input <= 0) return false;
                        if (input > callLimit) {
                            throw new Error('Maximum number of users is ' + callLimit);
                        }
                        return true;
                    }
                }
            ]
        });
    }

    execute(input: Input) {

        let role = input.getArgument('role') as Role | undefined;
        let amount = input.getArgument('amount') as number;

        //If role is set find all users in that role
        if (role && amount > 0) {
            if (amount > role.members.size) {
                amount = role.members.size
            }
            console.log('amount:' + amount);
            let members = role.members.random(amount);
            input.channel.send(members.join(', '));
        }
        //Handle invalid input
        else {
            if (amount > input.guild.memberCount) {
                amount = input.guild.memberCount;
            }
            if (amount) {

                let members = input.guild.members.random(amount);
                console.log("guild.memberCount: " + amount);
                input.channel.send(members.join(', '));
            }
        }
    }
}
