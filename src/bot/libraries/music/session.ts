import {SongInfo} from "@libraries/music/song-info";
import {Guild, GuildMember, Message, StreamDispatcher, TextChannel, VoiceConnection} from "discord.js";
import {MusicMessagePlayer} from "@libraries/music/music-message-player";
import {Input} from "@api";
import {getInfo, validateURL} from "ytdl-core";
import {VideoDownloader} from "@libraries/music/video-download";
import {ProgressBar} from "@libraries/utilities/progress-bar";
import {numberedList} from "@libraries/utilities/numbered-list";
import {Emoji} from "@libraries/emoji";
import {searchyt} from "@libraries/music/search-yt";
import {userRangedChoice} from "@libraries/utilities/user-range-choice";

export class Session {
    public guild: Guild;
    public currentlyPlaying?: SongInfo;
    public connection?: VoiceConnection;
    public channel: TextChannel;
    public dispatcher?: StreamDispatcher;
    public queue: SongInfo[];
    public autoplaying: boolean;
    public skipping: boolean;
    public messagePlayer: MusicMessagePlayer;

    constructor(guild: Guild, channel: TextChannel) {
        this.guild = guild;
        this.channel = channel;
        this.queue = [];
        this.autoplaying = false;
        this.skipping = false;

        this.messagePlayer = new MusicMessagePlayer(channel);
    };

    private async playUrl(url: string, member: GuildMember) {
        let info = await getInfo(url);

        let songInfo = new SongInfo(info.title, info, member, this.channel);

        await this.playQueue(songInfo);
    }

    async playQueue(video: SongInfo) {
        this.queue.push(video);

        if (!this.connection) {
            this.connection = await video.requester.voiceChannel.join();

            if (!this.connection) return;
            this.currentlyPlaying = this.queue.shift();
            if (this.currentlyPlaying) await this.messagePlayer.update(this.currentlyPlaying);
            await this.startStream();
        }
        else {
            await video.textChannel.send(`Added **${video.title}** to the queue at position **${this.queue.length}**`);
        }
    }

    async startStream() {
        if (!this.currentlyPlaying)
            throw new Error('Called startStream on an un-initialized server');

        let dl = new VideoDownloader(this.currentlyPlaying.url, this);
        let progressBar = new ProgressBar(`Buffering Song... **${this.currentlyPlaying.title}**`, this.currentlyPlaying.textChannel);

        await progressBar.initialize();

        dl.on('progress', percent => progressBar.update(percent));

        dl.on('complete', async (file) => {
            if (!this.currentlyPlaying)
                throw new Error('Called startStream on an un-initialized server');
            progressBar.update(1);
            this.currentlyPlaying.file = file;
            await this.seekStream(0);
        });
    }

    async seekStream(timeStamp: number) {
        if (!this.connection || !this.currentlyPlaying)
            throw new Error("Seek stream called on an unprepared server!");
        if (!this.currentlyPlaying.file)
            throw new Error("Server is ready, but no music file is set.");

        // console.log(`Attempting to seek in stream to ${timeStamp}`);

        let defaultVolume = this.guild.settings.voice.volume;
        let t = timeStamp || 0;

        this.skipping = true;
        this.dispatcher = await this.connection.playFile(this.currentlyPlaying.file,
            {
                seek: t,
                volume: defaultVolume,
                passes: 10,
                bitrate: 96000
            });
        this.dispatcher.setVolume(defaultVolume);
        this.createListeners();
        this.skipping = false;
    }

    private async playNextOrEnd() {
        if (this.skipping) return;
        this.skipping = true;
        if (this.queue.length > 0) {
            this.currentlyPlaying = this.queue.pop();
            await this.startStream();
            this.skipping = false;
            return;
        }
        if (this.currentlyPlaying) {
            await this.currentlyPlaying.textChannel.send('End of queue reached, leaving the voice channel.');
            this.currentlyPlaying = undefined;
        }
        if (this.connection)
            this.connection.disconnect();
        this.skipping = false;
    }

    createListeners() {
        if (!this.dispatcher || !this.currentlyPlaying)
            throw new Error('Called set listeners before stream was created');
        this.dispatcher.on('end', async () => {
            await this.playNextOrEnd();
        });
        this.dispatcher.on('start', async () => {
            if (!this.currentlyPlaying) return;
            // await this.currentlyPlaying.textChannel.send(`Now playing **${this.currentlyPlaying.title}**`)
            await this.messagePlayer.repost(this.currentlyPlaying);
        });
    }

    async enqueue() {
        if (!this.dispatcher || !this.currentlyPlaying) {
            await this.channel.send(`A song must currently be playing to use this command`);
            return;
        }
        if (this.queue.length <= 0) {
            await this.channel.send(`**The queue is empty**`);
            return;
        }

        await this.channel.send(numberedList(this.queue, 'title'));
    }

    async volume(volString: string | undefined) {
        if (volString == null) {
            return await this.channel.send(`Volume is currently **${this.guild.settings.voice.volume * 100}**%`);
        }

        let number = parseFloat(volString);

        if (!(!isNaN(number) && number <= 100 && number >= 1)) {
            return await this.channel.send(`Input must be a number from 1-100`);
        }

        this.guild.settings.voice.volume = number / 100;
        let vol = this.guild.settings.voice.volume;
        await this.guild.settings.save();

        if (this.dispatcher)
            this.dispatcher.setVolume(vol);

        await this.channel.send(`Setting volume to **${vol * 100}**%`);
    }

    async seek(options: string | undefined) {
        if (!this.dispatcher || !this.currentlyPlaying) {
            await this.channel.send(`A song must currently be playing to use this command`);
            return;
        }

        if (options == null) {
            await this.channel.send(`Enter the time in seconds to seek to`);
            return;
        }

        let number = parseFloat(options);

        if (!(!isNaN(number) && number <= 100 && number >= 1)) {
            await this.channel.send(`Input must be a number from 1-100`);
            return;
        }

        await this.seekStream(number);
    }

    async resume() {
        if (!this.dispatcher || !this.currentlyPlaying) {
            await this.channel.send(`A song must currently be playing to use this command`);
            return;
        }
        if (!this.dispatcher.paused) {
            await this.channel.send(`Music player is already playing`);
            return;
        }

        this.dispatcher.resume();
        await this.channel.send(`Resuming **${this.currentlyPlaying.title}**`);
    }

    async skip() {
        if (!this.dispatcher || !this.currentlyPlaying) {
            return await this.channel.send(`A song must currently be playing to use this command`);
        }

        this.dispatcher.emit('end');

        let msg = await this.channel.send(`Skipping ${this.currentlyPlaying.title}`) as Message;
        await sleep(2000);
        await msg.delete();
    }

    async pause() {

        if (!this.dispatcher || !this.currentlyPlaying) {
            return await this.channel.send(`${Emoji.ERROR} A song must currently be playing to use this command`);
        }

        if (this.dispatcher.paused) {
            return await this.channel.send(`${Emoji.ERROR} Music player is already paused`);
        }

        this.dispatcher.pause();
        await this.channel.send(`${Emoji.SUCCESS} Pausing **${this.currentlyPlaying.title}**`);
    }

    async search(input: Input, options: string | undefined) {
        if (options == null) {
            return await input.channel.send(`${Emoji.ERROR} Must specify a search term to this command`);
        }

        let ytresults = (await searchyt(options)).splice(0, 10);

        let choiceVid = await userRangedChoice(input, ytresults, 'title');

        await this.playUrl(choiceVid.url, input.member);
    }

    async play(input: Input, options: string | undefined) {
        if (options == null) {
            return await this.channel.send(`${Emoji.ERROR} Must specify a url or search term to use this command`);
        }

        let url = validateURL(options) ? options : (await searchyt(options))[0].url;

        await this.playUrl(url, input.member);
    }

    async autoplay(options: string | undefined) {
        if (options == null) {
            return await this.channel.send(`${Emoji.HELP} Autoplay is currently set to ${this.autoplaying}`);
        }

        if (/yes|1|true|on|/.test(options)) this.autoplaying = true;
        else if (/0|false|no|off/.test(options)) this.autoplaying = false;
    }

    async loop(options: string | undefined) {
        if (!this.dispatcher || !this.currentlyPlaying) {
            await this.channel.send(`A song must currently be playing to use this command`);
            return;
        }

        if (options == null) {
            return await this.channel.send(`Enter the time in seconds to seek to`);
        }

        let number = parseFloat(options);

        if (!(!isNaN(number) && number <= 10 && number >= 1)) {
            return await this.channel.send(`Input must be a number from 1-100`);
        }


    }
}