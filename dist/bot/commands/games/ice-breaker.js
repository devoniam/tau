"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class IceBreaker extends _api_1.Command {
    constructor() {
        super({
            name: 'breakice',
            description: 'Returns a random question to spark a conversation.'
        });
    }
    execute(input) {
        input.channel.send('Not yet implemented.');
    }
}
exports.IceBreaker = IceBreaker;
//# sourceMappingURL=ice-breaker.js.map