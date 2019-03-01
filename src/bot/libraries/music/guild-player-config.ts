import {SongInfo} from "@libraries/music/song-info";
import {Guild, StreamDispatcher, TextChannel, VoiceConnection} from "discord.js";
import {MusicMessagePlayer} from "@libraries/music/music-message-player";

export class GuildPlayerConfig {
    public guild: Guild;
    public currentlyPlaying?: SongInfo;
    public connection?: VoiceConnection;
    public dispatcher?: StreamDispatcher;
    public queue: SongInfo[];
    public autoplay: boolean;
    public messagePlayer?: MusicMessagePlayer;

    constructor(guild: Guild) {
        this.guild = guild;
        this.queue = [];
        this.autoplay = false;
    };
}