"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Balance extends _api_1.Command {
    constructor() {
        super({
            name: 'balance',
            aliases: ['bal', 'money'],
            description: 'Returns the current balance for the specified user.',
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
    execute(input) {
        let user = input.getArgument('user');
        input.channel.send('Not yet implemented.');
    }
}
exports.Balance = Balance;
//# sourceMappingURL=balance.js.map