"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Noun extends _api_1.Command {
    constructor() {
        super({
            name: 'noun',
            description: 'Returns a random noun.'
        });
    }
    execute(input) {
        input.channel.send('Not yet implemented.');
    }
}
exports.Noun = Noun;
//# sourceMappingURL=noun.js.map