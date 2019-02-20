"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Poem extends _api_1.Command {
    constructor() {
        super({
            name: 'poem',
            description: 'Returns a random poem.'
        });
    }
    execute(input) {
        input.channel.send('Not yet implemented.');
    }
}
exports.Poem = Poem;
//# sourceMappingURL=poem.js.map