import { Command, Input } from '@api';
import { Inventory } from '@bot/libraries/inventory';

export class CheckInventory extends Command {
    constructor() {
        super({
            name: 'inventory',
            description: 'Displays your inventory.'
        });
    }

    async execute(input: Input) {
        let items = await Inventory.getAllItems(input.member);
        let lines : string[] = [];

        _.each(items, item => {
            lines.push(`${item.icon}  **${item.name}** (${item.amount})`);
        });

        if (lines.length == 0) {
            lines.push('No inventory items found.');
        }

        await input.channel.send(lines.join('\n'));
    }
}
