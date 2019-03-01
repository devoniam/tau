"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Inventory {
    static async addItem(member, item, amount) {
        await member.load();
        member.settings.inventory[this.getIndex(member, item)].amount += amount;
        await member.settings.save();
    }
    static async removeItem(member, item, amount) {
        await member.load();
        let index = this.getIndex(member, item);
        let balance = member.settings.inventory[index].amount;
        if (amount > balance) {
            throw new Error(`Cannot spend ${amount} of ${Item[item]} when the balance is only ${balance}.`);
        }
        member.settings.inventory[index].amount -= amount;
        await member.settings.save();
    }
    static async hasItem(member, item, amount = 1) {
        await member.load();
        let index = this.getIndex(member, item);
        let balance = member.settings.inventory[index].amount;
        return amount <= balance;
    }
    static async getItemAmount(member, item) {
        await member.load();
        for (let i = 0; i < member.settings.inventory.length; i++) {
            if (member.settings.inventory[i].item == item) {
                return member.settings.inventory[i].amount;
            }
        }
        return 0;
    }
    static async getAllItems(member) {
        await member.load();
        let inventory = member.settings.inventory;
        let items = [];
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
    static getName(item) {
        return Item[item];
    }
    static getIcon(item) {
        return exports.InventoryIcons[this.getName(item)];
    }
    static getIndex(member, item) {
        for (let i = 0; i < member.settings.inventory.length; i++) {
            if (member.settings.inventory[i].item == item) {
                return i;
            }
        }
        member.settings.inventory.push({
            item: item,
            amount: 0
        });
        return member.settings.inventory.length - 1;
    }
}
exports.Inventory = Inventory;
var Item;
(function (Item) {
    Item[Item["Fish"] = 0] = "Fish";
    Item[Item["Star"] = 1] = "Star";
    Item[Item["Glitter"] = 2] = "Glitter";
    Item[Item["Bolt"] = 3] = "Bolt";
    Item[Item["Lollipop"] = 4] = "Lollipop";
    Item[Item["Strawberry"] = 5] = "Strawberry";
    Item[Item["Cookie"] = 6] = "Cookie";
    Item[Item["Cake"] = 7] = "Cake";
    Item[Item["Candy"] = 8] = "Candy";
    Item[Item["Trophy"] = 9] = "Trophy";
    Item[Item["Gift"] = 10] = "Gift";
    Item[Item["Book"] = 11] = "Book";
    Item[Item["Heart"] = 12] = "Heart";
    Item[Item["LoveLetter"] = 13] = "LoveLetter";
    Item[Item["Orange"] = 14] = "Orange";
    Item[Item["ChocolateBar"] = 15] = "ChocolateBar";
    Item[Item["Egg"] = 16] = "Egg";
    Item[Item["Case"] = 17] = "Case";
})(Item = exports.Item || (exports.Item = {}));
exports.InventoryIcons = {
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
};
//# sourceMappingURL=inventory.js.map