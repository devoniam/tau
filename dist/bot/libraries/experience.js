"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Experience {
    static async getExperience(member) {
        await member.load();
        return member.settings.experience;
    }
    static async getLevel(member) {
        await member.load();
        return member.settings.level;
    }
    static async addExperience(member, amount, announceChannel) {
        await member.load();
        member.settings.experience += amount;
        await this.level(member, announceChannel);
        await member.settings.save();
        return member.settings.level;
    }
    static async awardRandomExperience(member, min, max, announceChannel) {
        return await this.addExperience(member, _.random(min, max), announceChannel);
    }
    static async getExperienceGoal(member) {
        await member.load();
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
        let earned = 0;
        while (member.settings.experience >= goal) {
            member.settings.experience -= goal;
            member.settings.level++;
            member.settings.currency += 25;
            goal = await this.getExperienceGoal(member);
            changed = true;
            earned += 25;
        }
        if (changed) {
            await channel.send(`:sparkles:  **Level up!** ${member} is now level ${member.settings.level}.  :moneybag:  **+$${earned.toFixed(2)}**`);
        }
    }
    static async getAllLevels(guild) {
        let members = guild.members.array();
        let levels = [];
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            if (member.user.bot)
                continue;
            await member.load();
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
}
exports.Experience = Experience;
//# sourceMappingURL=experience.js.map