"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const emoji_1 = require("@libraries/emoji");
const session_1 = require("@libraries/music/session");
let trackedGuilds = {};
class Music extends _api_1.Command {
    constructor() {
        super({
            name: 'music',
            description: 'Controls the bot\'s voice activity.',
            arguments: [
                {
                    name: 'action',
                    required: true,
                    options: [
                        'play',
                        'search',
                        'stop',
                        'pause',
                        'skip',
                        'resume',
                        'volume',
                        'queue',
                        'loop',
                        'autoplaying',
                        'seek',
                        'lyrics'
                    ]
                },
                {
                    name: 'options',
                    required: false,
                    expand: true,
                }
            ]
        });
    }
    async execute(input) {
        let action = input.getArgument('action');
        let options = input.getArgument('options');
        let userVoiceChannel = input.member.voiceChannel;
        if (!userVoiceChannel) {
            await input.message.reply(`${emoji_1.Emoji.ERROR} You must be in a voice channel to use this command`);
            return;
        }
        let id = input.guild.id;
        let session = trackedGuilds[id] ? trackedGuilds[id] : trackedGuilds[id] = new session_1.Session(input.guild, input.channel);
        session.channel = input.channel;
        switch (action) {
            case 'play':
                await session.play(input, options);
                break;
            case 'search':
                await session.search(input, options);
                break;
            case 'stop':
                break;
            case 'pause':
                await session.pause();
                break;
            case 'skip':
                await session.skip();
                break;
            case 'resume':
                await session.resume();
                break;
            case 'volume':
                await session.volume(options);
                break;
            case 'queue':
                await session.enqueue();
                break;
            case 'loop':
                await session.loop(options);
                break;
            case 'autoplaying':
                await session.autoplay(options);
                break;
            case 'seek':
                await session.seek(options);
                break;
            case 'lyrics':
                break;
        }
    }
    getUsage() {
        return super.getUsage();
    }
}
exports.Music = Music;
//# sourceMappingURL=music.js.map