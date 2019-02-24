"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const experience_1 = require("@bot/libraries/experience");
class Level extends _api_1.Command {
    constructor() {
        super({
            name: 'level',
            description: 'Returns the current level and experience of the specified user.',
            arguments: [
                {
                    name: 'user',
                    constraint: 'mention',
                    default: '@member',
                    error: true
                }
            ]
        });
    }
    async execute(input) {
        let user = input.getArgument('user');
        let goal = await experience_1.Experience.getExperienceGoal(user) - user.settings.experience;
        input.channel.send(`:sparkles:  ${user} is level **${user.settings.level}** and needs **${goal}** more points to level up.`);
    }
}
exports.Level = Level;
//# sourceMappingURL=level.js.map