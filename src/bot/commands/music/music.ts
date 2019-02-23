import {Command, Input} from '@api';
import {Emoji} from "@libraries/emoji";
import {VoiceChannel} from "discord.js";
import {GuildPlayerConfig} from "@libraries/music/guild-player-config";
import * as cheerio from 'cheerio';
import * as request from 'request';
import {Response} from "request";
import {validateURL, getInfo, downloadFromInfo, videoInfo} from 'ytdl-core'
import {numberedList} from "@bot/libraries/utilities/numbered-list";
import {userRangedChoice} from "@libraries/utilities/user-range-choice";


let trackedGuilds: { [id: string]: GuildPlayerConfig } = {};

export class Music extends Command {
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
                    eval: (options: string, args) => {
                        let action = args[0].parsedValue;

                        if (action == 'play') throw new Error("Caught play command");
                        return true;
                    }
                }
            ]
        });
    }

    async execute(input: Input) {
        let action = input.getArgument('action') as string;
        let options = input.getArgument('options') as string | undefined;

        // Get the users voice channel
        let userVoiceChannel: VoiceChannel = input.member.voiceChannel;

        if (!userVoiceChannel) {
            await input.message.reply(`You must be in a voice channel to use this command`);
            return;
        }

        // Get the guilds music data configuration
        let id = input.guild.id;
        let playConfig = trackedGuilds[id] ? trackedGuilds[id] : trackedGuilds[id] = new GuildPlayerConfig(id);

        // Check to see if it's playing music
        if (playConfig.currentlyPlaying)
            this.getLogger().debug(`Currently playing ${playConfig.currentlyPlaying.title}`);


        let result: string = '';

        switch (action) {
            case 'play':
                if (options == null) {
                    await input.channel.send(`Must specify a url or search term to use this command`);
                    return;
                }

                let url = validateURL(options) ? options : (await this.searchyt(options))[0].url;
                let info = await getInfo(url);

                result += 'play';
                break;
            case 'search':
                if (options == null) {
                    await input.channel.send(`Must specify a search term to this command`);
                    return;
                }

                let ytresults = (await this.searchyt(options)).splice(0, 10);
                let userChoiceMsg = numberedList(ytresults, 'title');
                await input.channel.send(userChoiceMsg);

                // const filter = (n => !isNaN(n) && parseInt(n.content) <= ytresults.length && parseInt(n.content) > 0 && n.author.id === input.member.id);

                let response = `\n**Choose a number Between 1-${ytresults.length}**`;

                // await userRangedChoice(input.member, filter, ytresults.length);

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
                ///(yes|no|1|0|true|false|on|off)/
                result += 'autoplay';
                break;
            case 'seek':
                result += 'seek';
                break;
            case 'lyrics':
                result += 'lyrics';
                break;
        }

        await input.channel.send(Emoji.SUCCESS + `  Received play command with action ${result}`);
    }

    private playUrl(url: string) {
        console.log(`Attempting to play song ${url}`);
    }

    private searchyt(searchTerm: string): Promise<{ title: string, url: string }[]> {
        return new Promise((resolve, reject) => {
            let ytresults: { title: string, url: string }[] = [];

            request('https://www.youtube.com/results?search_query=' + searchTerm, (error: any, response: Response, body: any) => {
                if (error) return this.getLogger().error(error);
                let $ = cheerio.load(body);

                let results = $('h3.yt-lockup-title a');
                results.each((index: number, element: CheerioElement) => {
                    let row = $(element);

                    if (!(/\/watch\?v=([\w-]+)/.test(row.attr('href')))) return;

                    let title = row.text();
                    let url = row.attr('href');

                    ytresults.push({title, url});
                    // console.log(title, url);
                });

                resolve(ytresults);
            });
        });
    }

    getUsage(): string {
        // Override for usage information.
        // If we return a string with multiple lines, the first line is the `command <usage> <info>`.
        // The rest of the lines are shown as help text below it - we can use this to document the actions.

        return super.getUsage();
    }
}