"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
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
                    eval: (input) => input >= 1 && input <= 20
                }
            ]
        });
    }
    execute(input) {
        let role = input.getArgument('role');
        let amount = input.getArgument('amount');
        input.channel.send('Not yet implemented.');
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map