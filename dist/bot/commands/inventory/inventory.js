"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const inventory_1 = require("@bot/libraries/inventory");
class CheckInventory extends _api_1.Command {
    constructor() {
        super({
            name: 'inventory',
            description: 'Displays your inventory.'
        });
    }
    async execute(input) {
        let items = await inventory_1.Inventory.getAllItems(input.member);
        let lines = [];
        _.each(items, item => {
            lines.push(`${item.icon}  **${item.name}** (${item.amount})`);
        });
        if (lines.length == 0) {
            lines.push('No inventory items found.');
        }
        await input.channel.send(lines.join('\n'));
    }
}
exports.CheckInventory = CheckInventory;
//# sourceMappingURL=inventory.js.map