import {GuildMember, TextChannel} from "discord.js";
import {videoInfo} from "ytdl-core";

export class SongInfo {

    public title: string;
    public info: videoInfo;
    public url: string;
    public requester: GuildMember;
    public textChannel: TextChannel;

    constructor(title: string, info: videoInfo, requester: GuildMember, textChannel: TextChannel) {
        this.title = title;
        this.info = info;
        this.url = this.info.video_url;
        this.requester = requester;
        this.textChannel = textChannel;
    }
}