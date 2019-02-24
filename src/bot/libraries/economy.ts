import { Database } from "@api";
import { GuildMember } from "discord.js";
import { MemberBucket } from "@core/lib/database/member";
import { TextChannel } from "discord.js";
import { Guild } from "discord.js";

export class Economy {

    /**
     * Returns the balance of a guild member.
     */
    public static async getBalance(member: GuildMember) : Promise<number> {
        await this.load(member);
        return member.settings.currency;
    }

    /**
     * Sets the balance of a guild member. Returns the same number.
     */
    public static async setBalance(member: GuildMember, amount: number) : Promise<number> {
        await this.load(member);
        member.settings.currency = amount;
        await member.settings.save();
        return amount;
    }

    /**
     * Adds to the balance of a guild member. Returns the new balance. If `announceChannel` is set, the user will be
     * notified of the balance change automatically.
     */
    public static async addBalance(member: GuildMember, amount: number, announceChannel?: TextChannel) : Promise<number> {
        await this.load(member);

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
        await this.load(member);

        member.settings.currency -= amount;
        await member.settings.save();

        if (announceChannel) announceChannel.send(`:moneybag:  ${member} lost **$${amount.toFixed(2)}**`);

        return member.settings.currency;
    }

    /**
     * Add a random amount to the balance of a guild member. Returns the new balance.
     */
    public static async awardRandomBalance(member: GuildMember, min: number, max: number) : Promise<number> {
        await this.load(member);
        member.settings.currency -= _.random(min, max);
        await member.settings.save();
        return member.settings.currency;
    }

    /**
     * Returns `true` if the member has a balance equal to or greater than the specified amount.
     */
    public static async hasBalance(member: GuildMember, min: number) : Promise<boolean> {
        await this.load(member);
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

            // Make sure they have data loaded
            await this.load(member);

            // Push them
            balances.push({
                member: member,
                balance: member.settings.currency
            });
        }

        return _.orderBy(balances, 'balance', 'desc');
    }

    /**
     * Loads the member and ensures their `settings` object is set.
     */
    private static async load(member: GuildMember) {
        if (!member.settings) {
            member.settings = new MemberBucket(member.guild.id, member.id);
            await member.settings.load();
        }
    }

}

export type MemberBalance = {
    member: GuildMember,
    balance: number
};
