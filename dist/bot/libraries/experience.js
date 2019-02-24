"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const member_1 = require("@core/lib/database/member");
class Experience {
    static async getExperience(member) {
        await this.load(member);
        return member.settings.experience;
    }
    static async getLevel(member) {
        await this.load(member);
        return member.settings.level;
    }
    static async addExperience(member, amount, announceChannel) {
        await this.load(member);
        member.settings.experience += amount;
        await this.level(member, announceChannel);
        await member.settings.save();
        return member.settings.level;
    }
    static async awardRandomExperience(member, min, max, announceChannel) {
        return await this.addExperience(member, _.random(min, max), announceChannel);
    }
    static async getExperienceGoal(member) {
        await this.load(member);
        if (member.settings.level === 1)
            return 50;
        if (member.settings.level === 2)
            return 100;
        return Math.min(100 + (member.settings.level * 40), 4000);
    }
    static async getRank(member) {
        let levels = await this.getAllLevels(member.guild);
        let matches = _.filter(levels, l => { return l.member == member; });
        let row = _.first(matches);
        return row ? row.rank : -1;
    }
    static async level(member, announceChannel) {
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
            await channel.send(`:sparkles:  **Level up!** ${member} is now level **${member.settings.level}**.`);
        }
    }
    static async getAllLevels(guild) {
        let members = guild.members.array();
        let levels = [];
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            if (member.user.bot)
                continue;
            await this.load(member);
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
    static async load(member) {
        if (!member.settings) {
            member.settings = new member_1.MemberBucket(member.guild.id, member.id);
            await member.settings.load();
        }
    }
}
exports.Experience = Experience;
//# sourceMappingURL=experience.js.map