"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Economy {
    static async getBalance(member) {
        await member.load();
        return member.settings.currency;
    }
    static async setBalance(member, amount) {
        await member.load();
        member.settings.currency = amount;
        await member.settings.save();
        return amount;
    }
    static async addBalance(member, amount, announceChannel) {
        await member.load();
        member.settings.currency += amount;
        await member.settings.save();
        if (announceChannel)
            announceChannel.send(`:moneybag:  ${member} earned **$${amount.toFixed(2)}**`);
        return member.settings.currency;
    }
    static async removeBalance(member, amount, announceChannel) {
        await member.load();
        member.settings.currency -= amount;
        await member.settings.save();
        if (announceChannel)
            announceChannel.send(`:moneybag:  ${member} lost **$${amount.toFixed(2)}**`);
        return member.settings.currency;
    }
    static async awardRandomBalance(member, min, max) {
        await member.load();
        member.settings.currency -= _.random(min, max);
        await member.settings.save();
        return member.settings.currency;
    }
    static async hasBalance(member, min) {
        await member.load();
        return member.settings.currency >= min;
    }
    static async getAllBalances(guild) {
        let members = guild.members.array();
        let balances = [];
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            if (member.user.bot)
                continue;
            await member.load();
            balances.push({
                member: member,
                balance: member.settings.currency
            });
        }
        return _.orderBy(balances, 'balance', 'desc');
    }
}
exports.Economy = Economy;
//# sourceMappingURL=economy.js.map