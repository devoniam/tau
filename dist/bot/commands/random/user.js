"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
let callLimit = 10;
class User extends _api_1.Command {
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
                    eval: (input) => {
                        if (input <= 0)
                            return false;
                        if (input > callLimit) {
                            throw new Error('Maximum number of users is ' + callLimit);
                        }
                        return true;
                    }
                }
            ]
        });
    }
    execute(input) {
        let role = input.getArgument('role');
        let amount = input.getArgument('amount');
        if (role && amount > 0) {
            if (amount > role.members.size) {
                amount = role.members.size;
            }
            console.log('amount:' + amount);
            let members = role.members.random(amount);
            input.channel.send(members.join(', '));
        }
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
exports.User = User;
//# sourceMappingURL=user.js.map