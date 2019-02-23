"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const emoji_1 = require("@libraries/emoji");
const guild_player_config_1 = require("@libraries/music/guild-player-config");
const cheerio = require("cheerio");
const request = require("request");
const ytdl_core_1 = require("ytdl-core");
const numbered_list_1 = require("@bot/libraries/utilities/numbered-list");
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
                        'autoplay',
                        'seek',
                        'lyrics'
                    ]
                },
                {
                    name: 'options',
                    required: false,
                    expand: true,
                    eval: (options, args) => {
                        let action = args[0].parsedValue;
                        if (action == 'play')
                            throw new Error("Caught play command");
                        return true;
                    }
                }
            ]
        });
    }
    async execute(input) {
        let action = input.getArgument('action');
        let options = input.getArgument('options');
        let userVoiceChannel = input.member.voiceChannel;
        if (!userVoiceChannel) {
            await input.message.reply(`You must be in a voice channel to use this command`);
            return;
        }
        let id = input.guild.id;
        let playConfig = trackedGuilds[id] ? trackedGuilds[id] : trackedGuilds[id] = new guild_player_config_1.GuildPlayerConfig(id);
        if (playConfig.currentlyPlaying)
            this.getLogger().debug(`Currently playing ${playConfig.currentlyPlaying.title}`);
        let result = '';
        switch (action) {
            case 'play':
                if (options == null) {
                    await input.channel.send(`Must specify a url or search term to use this command`);
                    return;
                }
                let url = ytdl_core_1.validateURL(options) ? options : (await this.searchyt(options))[0].url;
                let info = await ytdl_core_1.getInfo(url);
                result += 'play';
                break;
            case 'search':
                if (options == null) {
                    await input.channel.send(`Must specify a search term to this command`);
                    return;
                }
                let ytresults = (await this.searchyt(options)).splice(0, 10);
                let userChoiceMsg = numbered_list_1.numberedList(ytresults, 'title');
                await input.channel.send(userChoiceMsg);
                let response = `\n**Choose a number Between 1-${ytresults.length}**`;
                result += 'search';
                break;
            case 'stop':
                result += 'stop';
                break;
            case 'pause':
                result += 'pause';
                break;
            case 'skip':
                result += 'skip';
                break;
            case 'resume':
                result += 'resume';
                break;
            case 'volume':
                result += 'volume';
                break;
            case 'queue':
                result += 'queue';
                break;
            case 'loop':
                result += 'loop';
                break;
            case 'autoplay':
                result += 'autoplay';
                break;
            case 'seek':
                result += 'seek';
                break;
            case 'lyrics':
                result += 'lyrics';
                break;
        }
        await input.channel.send(emoji_1.Emoji.SUCCESS + `  Received play command with action ${result}`);
    }
    playUrl(url) {
        console.log(`Attempting to play song ${url}`);
    }
    searchyt(searchTerm) {
        return new Promise((resolve, reject) => {
            let ytresults = [];
            request('https://www.youtube.com/results?search_query=' + searchTerm, (error, response, body) => {
                if (error)
                    return this.getLogger().error(error);
                let $ = cheerio.load(body);
                let results = $('h3.yt-lockup-title a');
                results.each((index, element) => {
                    let row = $(element);
                    if (!(/\/watch\?v=([\w-]+)/.test(row.attr('href'))))
                        return;
                    let title = row.text();
                    let url = row.attr('href');
                    ytresults.push({ title, url });
                });
                resolve(ytresults);
            });
        });
    }
    getUsage() {
        return super.getUsage();
    }
}
exports.Music = Music;
//# sourceMappingURL=music.js.map