"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const experience_1 = require("@bot/libraries/experience");
class AwardExperience extends _api_1.Listener {
    async onMessage(message) {
        let member = message.member;
        if (member.user.bot)
            return;
        if (message.channel.type != 'text')
            return;
        if (member.settings.lastExperienceAwardTime >= (_.now() - 60000))
            return;
        member.settings.lastExperienceAwardTime = _.now();
        await experience_1.Experience.awardRandomExperience(member, 10, 20, message.channel);
    }
}
exports.AwardExperience = AwardExperience;
//# sourceMappingURL=award-experience.js.map