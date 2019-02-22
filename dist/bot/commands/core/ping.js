"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const framework_1 = require("@core/framework");
class Ping extends _api_1.Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Returns the bot\'s current latency.'
        });
    }
    execute(input) {
        let pingValue = framework_1.Framework.getClient().ping;
        pingValue = Number(pingValue.toPrecision(4));
        input.channel.send(":satellite: Bot's last ping to server was **" + pingValue + " ms.**");
    }
}
exports.Ping = Ping;
//# sourceMappingURL=ping.js.map