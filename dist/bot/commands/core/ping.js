"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Ping extends _api_1.Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Returns the bot\'s current latency.'
        });
    }
    execute(input) {
        input.channel.send('Not yet implemented.');
    }
}
exports.Ping = Ping;
