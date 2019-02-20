"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Redeem extends _api_1.Command {
    constructor() {
        super({
            name: 'redeem',
            aliases: ['daily'],
            description: 'Redeems a random amount of daily currency.',
        });
    }
    execute(input) {
        input.channel.send('Not yet implemented.');
    }
}
exports.Redeem = Redeem;
//# sourceMappingURL=redeem.js.map