"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Uptime extends _api_1.Command {
    constructor() {
        super({
            name: 'uptime',
            description: 'Returns how long the bot has been online and running.',
        });
    }
    execute(input) {
        input.channel.send('Not yet implemented.');
    }
}
exports.Uptime = Uptime;
//# sourceMappingURL=uptime.js.map