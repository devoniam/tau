"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class InspirationalQuote extends _api_1.Command {
    constructor() {
        super({
            name: 'inspiration',
            aliases: ['inspire', 'inspirational'],
            description: 'Returns a random inspirational quote.'
        });
    }
    execute(input) {
        input.channel.send('Not yet implemented.');
    }
}
exports.InspirationalQuote = InspirationalQuote;
//# sourceMappingURL=inspirational-quote.js.map