import {Command, Input} from '@api';
import {Emoji} from "@libraries/emoji";
import {Guild, TextChannel, VoiceChannel} from "discord.js";
import {GuildPlayerConfig} from "@libraries/music/guild-player-config";
import {validateURL, getInfo} from 'ytdl-core'
import {userRangedChoice} from "@libraries/utilities/user-range-choice";
import {searchyt} from "@libraries/music/search-yt";
import {ProgressBar} from "@libraries/utilities/progress-bar";
import {VideoDownloader} from "@libraries/music/video-download";
import {SongInfo} from "@libraries/music/song-info";
import {numberedList} from "@libraries/utilities/numbered-list";
import {MusicMessagePlayer} from "@libraries/music/music-message-player";

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
                    // eval: (options: string, args) => {
                    //     let action = args[0].parsedValue;
                    //
                    //     if (action == 'play') throw new Error("Caught play command");
                    //     return true;
                    // }
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
        let playConfig = trackedGuilds[id] ? trackedGuilds[id] : trackedGuilds[id] = new GuildPlayerConfig(input.guild);

        let result: string = '';

        switch (action) {
            case 'play':
                if (options == null) {
                    await input.channel.send(`Must specify a url or search term to use this command`);
                    return;
                }

                let url = validateURL(options) ? options : (await searchyt(options))[0].url;

                await this.playUrl(url, input, playConfig);

                break;
            case 'search':
                if (options == null) {
                    await input.channel.send(`Must specify a search term to this command`);
                    return;
                }

                let ytresults = (await searchyt(options)).splice(0, 10);

                let choiceVid = await userRangedChoice(input, ytresults, 'title');

                await this.playUrl(choiceVid.url, input, playConfig);

                break;
            case 'stop':
                result += 'stop';
                break;
            case 'pause':
                if (!playConfig.dispatcher || !playConfig.currentlyPlaying) {
                    await input.channel.send(`A song must currently be playing to use this command`);
                    return;
                }
                if (playConfig.dispatcher.paused) {
                    await input.channel.send(`Music player is already paused`);
                    return;
                }

                playConfig.dispatcher.pause();
                await input.channel.send(`Pausing **${playConfig.currentlyPlaying.title}**`);

                result += 'pause';
                break;
            case 'skip':
                if (!playConfig.dispatcher || !playConfig.currentlyPlaying) {
                    await input.channel.send(`A song must currently be playing to use this command`);
                    return;
                }

                playConfig.dispatcher.emit('end');

                await input.channel.send(`Skipping ${playConfig.currentlyPlaying.title}`);

                result += 'skip';
                break;
            case 'resume':
                if (!playConfig.dispatcher || !playConfig.currentlyPlaying) {
                    await input.channel.send(`A song must currently be playing to use this command`);
                    return;
                }
                if (!playConfig.dispatcher.paused) {
                    await input.channel.send(`Music player is already playing`);
                    return;
                }

                playConfig.dispatcher.resume();
                await input.channel.send(`Resuming **${playConfig.currentlyPlaying.title}**`);

                result += 'resume';
                break;
            case 'volume':
                let volumeMsg = await this.setVolume(playConfig, options);
                await input.channel.send(volumeMsg);
                result += 'volume';
                break;
            case 'queue':
                if (!playConfig.dispatcher || !playConfig.currentlyPlaying) {
                    await input.channel.send(`A song must currently be playing to use this command`);
                    return;
                }
                if (playConfig.queue.length <= 0) {
                    await input.channel.send(`**The queue is empty**`);
                    return;
                }

                await input.channel.send(numberedList(playConfig.queue, 'title'));

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
                // if (!playConfig.dispatcher || !playConfig.currentlyPlaying) {
                //     await input.channel.send(`A song must currently be playing to use this command`);
                //     return;
                // }
                //
                // if (options == null) return `Enter the time in seconds to seek to`;
                //
                // let number = parseFloat(options);
                //
                // if (!(!isNaN(number) && number <= 100 && number >= 1)) return `Input must be a number from 1-100`;
                //
                // this.seekStream(playConfig, number);
                result += 'seek';
                break;
            case 'lyrics':
                result += 'lyrics';
                break;
        }

        await input.channel.send(Emoji.SUCCESS + `  Received play command with action ${result}`);
    }

    private async playUrl(url: string, input: Input, playConfig: GuildPlayerConfig) {
        let info = await getInfo(url);

        let songInfo = new SongInfo(info.title, info, input.member, input.channel as TextChannel);

        await this.playQueue(playConfig, songInfo);
    }

    async playQueue(server: GuildPlayerConfig, video: SongInfo) {
        server.queue.push(video);

        if (!server.connection) {
            server.connection = await video.requester.voiceChannel.join();

            if (!server.connection) return;
            server.currentlyPlaying = server.queue.shift();
            await this.startStream(server);
        }
        else {
            await video.textChannel.send(`Added **${video.title}** to the queue at position **${server.queue.length}**`);
        }
    }

    async startStream(server: GuildPlayerConfig) {
        if (!server.currentlyPlaying)
            throw new Error('Called startStream on an un-initialized server');

        let dl = new VideoDownloader(server.currentlyPlaying.url, server);
        let progressBar = new ProgressBar(`Buffering Song... **${server.currentlyPlaying.title}**`, server.currentlyPlaying.textChannel);

        await progressBar.initialize();

        dl.on('progress', percent => progressBar.update(percent));

        dl.on('complete', async (file) => {
            if (!server.currentlyPlaying)
                throw new Error('Called startStream on an un-initialized server');
            progressBar.update(1);
            server.currentlyPlaying.file = file;
            await this.seekStream(server, 0);
        });
    }

    async seekStream(server: GuildPlayerConfig, timeStamp: number) {
        if (!server.connection || !server.currentlyPlaying)
            throw new Error("Seek stream called on an unprepared server!");
        if (!server.currentlyPlaying.file)
            throw new Error("Server is ready, but no music file is set.");

        console.log(`Attempting to seek in stream to ${timeStamp}`);

        if (!server.messagePlayer)
            server.messagePlayer = new MusicMessagePlayer(server.currentlyPlaying.textChannel);

        let defaultVolume = server.guild.settings.voice.volume;
        let t = timeStamp || 0;

        server.dispatcher = await server.connection.playFile(server.currentlyPlaying.file,
            {
                seek: t,
                volume: defaultVolume,
                passes: 10,
                bitrate: 96000
            });
        server.dispatcher.setVolume(defaultVolume);
        this.createListeners(server);
    }

    getUsage(): string {
        // Override for usage information.
        // If we return a string with multiple lines, the first line is the `command <usage> <info>`.
        // The rest of the lines are shown as help text below it - we can use this to document the actions.

        return super.getUsage();
    }

    private async setVolume(config: GuildPlayerConfig, volString: string | undefined): Promise<string> {

        if (volString == null) return `Volume is currently **${config.guild.settings.voice.volume * 100}**%`;

        let number = parseFloat(volString);

        if (!(!isNaN(number) && number <= 100 && number >= 1)) return `Input must be a number from 1-100`;

        config.guild.settings.voice.volume = number / 100;
        let vol = config.guild.settings.voice.volume;
        await config.guild.settings.save();

        if (config.dispatcher)
            config.dispatcher.setVolume(vol);

        return `Setting volume to **${vol * 100}**%`;
    }

    private playNextOrEnd(server: GuildPlayerConfig) {

    }

    createListeners(server: GuildPlayerConfig) {
        if (!server.dispatcher || !server.currentlyPlaying)
            throw new Error('Called set listeners before stream was created');
        server.dispatcher.on('end', async () => {
            if (server.currentlyPlaying)
                server.currentlyPlaying.textChannel.send('End of queue reached, leaving the voice channel.');
            if (server.connection)
                server.connection.disconnect();
        });
    }
}