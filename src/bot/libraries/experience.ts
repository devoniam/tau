import { Database } from "@api";
import { GuildMember } from "discord.js";
import { MemberBucket } from "@core/lib/database/member";
import { TextChannel } from "discord.js";
import { Guild } from "discord.js";
import { Channel } from "discord.js";

export class Experience {

    /**
     * Returns the experience points of a guild member.
     */
    public static async getExperience(member: GuildMember) : Promise<number> {
        await this.load(member);
        return member.settings.experience;
    }

    /**
     * Returns the level of a guild member.
     */
    public static async getLevel(member: GuildMember) : Promise<number> {
        await this.load(member);
        return member.settings.level;
    }

    /**
     * Adds to the experience points of a guild member. Returns the new level. If `announceChannel` is set, the user
     * will be notified of levelup in that channel. Otherwise, the default is used.
     */
    public static async addExperience(member: GuildMember, amount: number, announceChannel?: Channel) : Promise<number> {
        await this.load(member);

        // Add the experience
        member.settings.experience += amount;

        // Level up if possible
        await this.level(member, announceChannel);

        // Save changes
        await member.settings.save();

        // Return new level
        return member.settings.level;
    }

    /**
     * Add a random amount to the balance of a guild member. Returns the new level. If `announceChannel` is set, the user
     * will be notified of levelup in that channel. Otherwise, the default is used.
     */
    public static async awardRandomExperience(member: GuildMember, min: number, max: number, announceChannel?: Channel) : Promise<number> {
        return await this.addExperience(member, _.random(min, max), announceChannel);
    }

    /**
     * Returns the experience goal for the guild member.
     */
    public static async getExperienceGoal(member: GuildMember) : Promise<number> {
        await this.load(member);

        if (member.settings.level === 1) return 50;
        if (member.settings.level === 2) return 100;

        return Math.min(100 + (member.settings.level * 40), 4000)
    }

    /**
     * Returns the rank for a guild member. Warning! This method is processor-heavy on large servers.
     */
    public static async getRank(member: GuildMember) : Promise<number> {
        let levels = await this.getAllLevels(member.guild);
        let matches = _.filter(levels, l => { return l.member == member });
        let row = _.first(matches);

        return row ? row.rank : -1;
    }

    /**
     * Levels up the given member if applicable. Does not automatically save.
     */
    private static async level(member: GuildMember, announceChannel: Channel | undefined) {
        let channel = announceChannel || member.guild.getDefaultChannel();
        let goal = await this.getExperienceGoal(member);
        let changed = false;

        while (member.settings.experience >= goal) {
            member.settings.experience -= goal;
            member.settings.level++;
            goal = await this.getExperienceGoal(member);
            changed = true;
        }

        if (changed) {
            await (<TextChannel>channel).send(`:sparkles:  **Level up!** ${member} is now level **${member.settings.level}**.`);
        }
    }

    /**
     * Returns an array of members along with their levels, experience points, and ranks. By default this is sorted from
     * greatest to least level and experience.
     */
    public static async getAllLevels(guild: Guild) : Promise<MemberExperience[]> {
        let members = guild.members.array();
        let levels : MemberExperience[] = [];

        for (let i = 0; i < members.length; i++) {
            let member = members[i];

            // Skip bots
            if (member.user.bot) continue;

            // Make sure they have data loaded
            await this.load(member);

            // Push them
            levels.push({
                member: member,
                level: member.settings.level,
                experience: member.settings.experience,
                experienceGoal: await this.getExperienceGoal(member),
                rank: 0
            });
        }

        levels = _.orderBy(levels, ['level', 'experience'], ['desc', 'desc']);
        levels.forEach((level, i) => { level.rank = i + 1; });

        return levels;
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

export type MemberExperience = {
    member: GuildMember,
    level: number,
    experience: number,
    experienceGoal: number,
    rank: number
};
