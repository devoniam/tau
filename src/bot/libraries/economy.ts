import { GuildMember } from "discord.js";
import { TextChannel } from "discord.js";
import { Guild } from "discord.js";

export class Economy {

    /**
     * Returns the balance of a guild member.
     */
    public static async getBalance(member: GuildMember) : Promise<number> {
        await member.load();
        return member.settings.currency;
    }

    /**
     * Sets the balance of a guild member. Returns the same number.
     */
    public static async setBalance(member: GuildMember, amount: number) : Promise<number> {
        await member.load();
        member.settings.currency = amount;
        await member.settings.save();
        return amount;
    }

    /**
     * Adds to the balance of a guild member. Returns the new balance. If `announceChannel` is set, the user will be
     * notified of the balance change automatically.
     */
    public static async addBalance(member: GuildMember, amount: number, announceChannel?: TextChannel) : Promise<number> {
        await member.load();

        member.settings.currency += amount;
        await member.settings.save();

        if (announceChannel) announceChannel.send(`:moneybag:  ${member} earned **$${amount.toFixed(2)}**`);

        return member.settings.currency;
    }

    /**
     * Adds to the balance of a guild member. Returns the new balance. If `announceChannel` is set, the user will be
     * notified of the balance change automatically.
     */
    public static async removeBalance(member: GuildMember, amount: number, announceChannel?: TextChannel) : Promise<number> {
        await member.load();

        member.settings.currency -= amount;
        await member.settings.save();

        if (announceChannel) announceChannel.send(`:moneybag:  ${member} lost **$${amount.toFixed(2)}**`);

        return member.settings.currency;
    }

    /**
     * Add a random amount to the balance of a guild member. Returns the new balance.
     */
    public static async awardRandomBalance(member: GuildMember, min: number, max: number) : Promise<number> {
        await member.load();
        member.settings.currency -= _.random(min, max);
        await member.settings.save();
        return member.settings.currency;
    }

    /**
     * Returns `true` if the member has a balance equal to or greater than the specified amount.
     */
    public static async hasBalance(member: GuildMember, min: number) : Promise<boolean> {
        await member.load();
        return member.settings.currency >= min;
    }

    /**
     * Returns an array of members and their balances. By default this is sorted from greatest to least.
     */
    public static async getAllBalances(guild: Guild) : Promise<MemberBalance[]> {
        let members = guild.members.array();
        let balances : MemberBalance[] = [];

        for (let i = 0; i < members.length; i++) {
            let member = members[i];

            // Skip bots
            if (member.user.bot) continue;

            // Make sure they have data loaded
            await member.load();

            // Push them
            balances.push({
                member: member,
                balance: member.settings.currency
            });
        }

        return _.orderBy(balances, 'balance', 'desc');
    }

}

export type MemberBalance = {
    member: GuildMember,
    balance: number
};
