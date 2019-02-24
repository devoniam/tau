"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const request = require("request");
const emoji_1 = require("@bot/libraries/emoji");
class Avatar extends _api_1.Command {
    constructor() {
        super({
            name: 'avatar',
            description: 'Returns the full avatar for the specified user.',
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
        let promise = new Promise((resolve, reject) => {
            request(user.user.avatarURL, { encoding: null }, function (err, response, buffer) {
                if (err)
                    return reject(err);
                resolve(buffer);
            });
        });
        let message = await input.channel.send(`${emoji_1.Emoji.LOADING}  Retrieving avatar...`);
        try {
            input.channel.send({
                file: await promise
            });
            await message.delete();
        }
        catch (err) {
            await message.edit(`${emoji_1.Emoji.ERROR}  Failed to download avatar, try again in a few moments.`);
            message.deleteAfter(6000);
        }
    }
}
exports.Avatar = Avatar;
//# sourceMappingURL=avatar.js.map