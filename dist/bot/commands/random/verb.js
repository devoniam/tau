"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Verb extends _api_1.Command {
    constructor() {
        super({
            name: 'verb',
            description: 'Returns a random verb.'
        });
    }
    execute(input) {
        input.channel.send('Not yet implemented.');
    }
}
exports.Verb = Verb;
//# sourceMappingURL=verb.js.map