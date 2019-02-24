"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const framework_1 = require("@core/framework");
const moment = require("moment");
class Uptime extends _api_1.Command {
    constructor() {
        super({
            name: 'uptime',
            description: 'Returns how long the bot has been online and running.',
        });
    }
    execute(input) {
        let onlineSince = _.now() - framework_1.Framework.getClient().uptime;
        let m = moment(onlineSince);
        let online = m.fromNow(true);
        input.channel.send(`:clock4:  Bot has been running for **${online}**.`);
    }
}
exports.Uptime = Uptime;
//# sourceMappingURL=uptime.js.map