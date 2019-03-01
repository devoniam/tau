"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const emoji_1 = require("@libraries/emoji");
const guild_player_config_1 = require("@libraries/music/guild-player-config");
const ytdl_core_1 = require("ytdl-core");
const user_range_choice_1 = require("@libraries/utilities/user-range-choice");
const search_yt_1 = require("@libraries/music/search-yt");
const progress_bar_1 = require("@libraries/utilities/progress-bar");
const video_download_1 = require("@libraries/music/video-download");
const song_info_1 = require("@libraries/music/song-info");
const numbered_list_1 = require("@libraries/utilities/numbered-list");
const music_message_player_1 = require("@libraries/music/music-message-player");
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
        let playConfig = trackedGuilds[id] ? trackedGuilds[id] : trackedGuilds[id] = new guild_player_config_1.GuildPlayerConfig(input.guild);
        let result = '';
        switch (action) {
            case 'play':
                if (options == null) {
                    await input.channel.send(`Must specify a url or search term to use this command`);
                    return;
                }
                let url = ytdl_core_1.validateURL(options) ? options : (await search_yt_1.searchyt(options))[0].url;
                await this.playUrl(url, input, playConfig);
                break;
            case 'search':
                if (options == null) {
                    await input.channel.send(`Must specify a search term to this command`);
                    return;
                }
                let ytresults = (await search_yt_1.searchyt(options)).splice(0, 10);
                let choiceVid = await user_range_choice_1.userRangedChoice(input, ytresults, 'title');
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
                await input.channel.send(numbered_list_1.numberedList(playConfig.queue, 'title'));
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
    async playUrl(url, input, playConfig) {
        let info = await ytdl_core_1.getInfo(url);
        let songInfo = new song_info_1.SongInfo(info.title, info, input.member, input.channel);
        await this.playQueue(playConfig, songInfo);
    }
    async playQueue(server, video) {
        server.queue.push(video);
        if (!server.connection) {
            server.connection = await video.requester.voiceChannel.join();
            if (!server.connection)
                return;
            server.currentlyPlaying = server.queue.shift();
            await this.startStream(server);
        }
        else {
            await video.textChannel.send(`Added **${video.title}** to the queue at position **${server.queue.length}**`);
        }
    }
    async startStream(server) {
        if (!server.currentlyPlaying)
            throw new Error('Called startStream on an un-initialized server');
        let dl = new video_download_1.VideoDownloader(server.currentlyPlaying.url, server);
        let progressBar = new progress_bar_1.ProgressBar(`Buffering Song... **${server.currentlyPlaying.title}**`, server.currentlyPlaying.textChannel);
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
    async seekStream(server, timeStamp) {
        if (!server.connection || !server.currentlyPlaying)
            throw new Error("Seek stream called on an unprepared server!");
        if (!server.currentlyPlaying.file)
            throw new Error("Server is ready, but no music file is set.");
        console.log(`Attempting to seek in stream to ${timeStamp}`);
        if (!server.messagePlayer)
            server.messagePlayer = new music_message_player_1.MusicMessagePlayer(server.currentlyPlaying.textChannel);
        let defaultVolume = server.guild.settings.voice.volume;
        let t = timeStamp || 0;
        server.dispatcher = await server.connection.playFile(server.currentlyPlaying.file, {
            seek: t,
            volume: defaultVolume,
            passes: 10,
            bitrate: 96000
        });
        server.dispatcher.setVolume(defaultVolume);
        this.createListeners(server);
    }
    getUsage() {
        return super.getUsage();
    }
    async setVolume(config, volString) {
        if (volString == null)
            return `Volume is currently **${config.guild.settings.voice.volume * 100}**%`;
        let number = parseFloat(volString);
        if (!(!isNaN(number) && number <= 100 && number >= 1))
            return `Input must be a number from 1-100`;
        config.guild.settings.voice.volume = number / 100;
        let vol = config.guild.settings.voice.volume;
        await config.guild.settings.save();
        if (config.dispatcher)
            config.dispatcher.setVolume(vol);
        return `Setting volume to **${vol * 100}**%`;
    }
    playNextOrEnd(server) {
    }
    createListeners(server) {
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
exports.Music = Music;
//# sourceMappingURL=music.js.map