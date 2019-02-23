import {SongInfo} from "@libraries/music/song-info";
import {VoiceConnection} from "discord.js";

export class GuildPlayerConfig {
    public id: string;
    public currentlyPlaying?: SongInfo;
    public conenction?: VoiceConnection;
    public queue: SongInfo[];
    public autoplay: boolean;

    constructor(id: string) {
        this.id = id;
        this.queue = [];
        this.autoplay = false;
    };
}