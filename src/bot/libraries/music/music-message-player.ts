import {Message, TextChannel} from "discord.js";
import {SongInfo} from "@libraries/music/song-info";
import {Framework} from "@core/framework";

export class MusicMessagePlayer {
    channel: TextChannel;
    playerMessage?: Message;
    status: Status;

    constructor(channel: TextChannel) {
        this.channel = channel;
        this.status = Status.PLAYING;
        this.channel.send(this.populate()).then((r: Message | Message[]) => {
                this.playerMessage = r as Message;
            }
        );
    }

    populate(song?: SongInfo) {
        let result = {
            embed: {
                color: 3447003,
                // thumbnail: "https://media.discordapp.net/attachments/535655757597769738/551215168101548069/file.jpg?width=300&height=300",
                author: {
                    name: Framework.getClient().user.username + " - Music player",
                    icon_url: Framework.getClient().user.avatarURL
                },
                title: "**" + (song ? song.title : "This is an embed") + "**",
                url: song ? song.url : "http://google.com",
                description:  "",
                fields: [
                    {
                        name: "Description",
                        value: song ? song.info.description.slice(0, 300) + "..." : "They can have different fields with small headlines."
                    }
                ],
                timestamp: new Date(),
                footer: {
                    // icon_url: client.user.avatarURL,
                    text: "© Example"
                }
            }
        };
        return result;
    }

    async update(song: SongInfo) {
        if (this.playerMessage) {
            await this.playerMessage.edit(this.populate(song));
        }
    }

    async repost(song: SongInfo) {
        if (this.playerMessage) {
            await this.playerMessage.delete();
            this.playerMessage = await this.channel.send(this.populate(song)) as Message;
        }
    }
}

export enum Status {
    PLAYING = 'playing',
    PAUSED = 'paused',
    SKIPPING  = 'skipping',
}