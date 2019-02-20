"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Pun extends _api_1.Command {
    constructor() {
        super({
            name: 'pun',
            description: 'Returns a random pun.'
        });
    }
    execute(input) {
        input.channel.send('Not yet implemented.');
    }
}
exports.Pun = Pun;
