import { GuildMember } from "discord.js";

export class Inventory {
    /**
     * Adds an item to the inventory of a member.
     */
    public static async addItem(member: GuildMember, item: Item, amount: number) : Promise<void> {
        await member.load();

        // Add the amount
        member.settings.inventory[this.getIndex(member, item)].amount += amount;

        // Save
        await member.settings.save();
    }

    /**
     * Removes an item from the inventory of a member.
     */
    public static async removeItem(member: GuildMember, item: Item, amount: number) : Promise<void> {
        await member.load();

        // Find the index of the item and the current balance
        let index = this.getIndex(member, item);
        let balance = member.settings.inventory[index].amount;

        // Check for validity
        if (amount > balance) {
            throw new Error(`Cannot spend ${amount} of ${Item[item]} when the balance is only ${balance}.`);
        }

        // Subtract the amount
        member.settings.inventory[index].amount -= amount;

        // Save
        await member.settings.save();
    }

    /**
     * Returns true if the member has the specified amount of the given item, or if an amount is not specified,
     * has any number of the given item.
     */
    public static async hasItem(member: GuildMember, item: Item, amount: number = 1) : Promise<boolean> {
        await member.load();

        // Find the index of the item and the current balance
        let index = this.getIndex(member, item);
        let balance = member.settings.inventory[index].amount;

        // Check if the balance is high enough
        return amount <= balance;
    }

    /**
     * Returns the amount of the given item the member has.
     */
    public static async getItemAmount(member: GuildMember, item: Item) : Promise<number> {
        await member.load();

        for (let i = 0; i < member.settings.inventory.length; i++) {
            if (member.settings.inventory[i].item == item) {
                return member.settings.inventory[i].amount;
            }
        }

        return 0;
    }

    /**
     * Returns an array of all inventory items in the member's possession.
     */
    public static async getAllItems(member: GuildMember) : Promise<InventoryItem[]> {
        await member.load();

        let inventory = member.settings.inventory;
        let items : InventoryItem[] = [];

        _.each(inventory, row => {
            items.push({
                id: row.item,
                name: this.getName(row.item),
                icon: this.getIcon(row.item),
                amount: row.amount
            });
        });

        return items;
    }

    /**
     * Returns the name of an item as a string, given its index or enum value.
     */
    public static getName(item: Item) : string {
        return Item[item];
    }

    /**
     * Returns the emoji of the given item as a unicode string.
     */
    public static getIcon(item: Item) : string {
        return InventoryIcons[this.getName(item)];
    }

    /**
     * Returns the index of the given item in the inventory. If the item is not in the inventory, an entry is created
     * and its index is returned.
     */
    private static getIndex(member: GuildMember, item: Item) : number {
        // Look for an existing entry
        for (let i = 0; i < member.settings.inventory.length; i++) {
            if (member.settings.inventory[i].item == item) {
                return i;
            }
        }

        // Not found, so add a new entry
        member.settings.inventory.push({
            item: item,
            amount: 0
        });

        // Return the new index
        return member.settings.inventory.length - 1;
    }
}

export type InventoryItem = {
    id: number;
    name: string;
    amount: number;
    icon: string;
}

export enum Item {
    Fish,
    Star,
    Glitter,
    Bolt,
    Lollipop,
    Strawberry,
    Cookie,
    Cake,
    Candy,
    Trophy,
    Gift,
    Book,
    Heart,
    LoveLetter,
    Orange,
    ChocolateBar,
    Egg,
    Case
}

export let InventoryIcons : {[name: string]: string} = {
    Fish: '🐟',
    Star: '⭐',
    Glitter: '✨',
    Bolt: '⚡',
    Lollipop: '🍭',
    Strawberry: '🍓',
    Cookie: '🍪',
    Cake: '🍰',
    Candy: '🍬',
    Trophy: '🏆',
    Gift: '🎁',
    Book: '📘',
    Heart: '💖',
    LoveLetter: '💌',
    Orange: '🍊',
    ChocolateBar: '🍫',
    Egg: '🥚',
    Case: '💼'
}
