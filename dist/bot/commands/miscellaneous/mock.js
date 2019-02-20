"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Mock extends _api_1.Command {
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
    execute(input) {
        let user = input.getArgument('user');
        let lastMessage = user.lastMessage;
        let lastMessageText = lastMessage.content;
        input.channel.send('Not yet implemented.');
    }
}
exports.Mock = Mock;
//# sourceMappingURL=mock.js.map