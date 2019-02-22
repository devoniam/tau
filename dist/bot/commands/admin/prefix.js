"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const emoji_1 = require("@bot/libraries/emoji");
class Prefix extends _api_1.Command {
    constructor() {
        super({
            name: 'prefix',
            description: 'Changes the prefix for the bot for a server.',
            arguments: [
                {
                    name: 'char',
                    description: 'A new single character to use as the prefix.',
                    options: ['!', '@', '#', '$', '%', '^', '&', '*', '<', '>', ',', '.', '/', '?', ':', ';', '|', '~', '`', '=', '+', '-'],
                    usage: 'character',
                    required: true
                }
            ]
        });
    }
    async execute(input) {
        let char = input.getArgument('char');
        let settings = input.guild.settings;
        settings.prefix = char;
        await settings.save();
        input.channel.send(emoji_1.Emoji.SUCCESS + '  Your custom prefix has been set. Now give it a try!');
    }
}
exports.Prefix = Prefix;
//# sourceMappingURL=prefix.js.map