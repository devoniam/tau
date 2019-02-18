import { Bucket } from "../bucket";

export class GuildBucket extends Bucket {
    protected table = 'guilds';

    public prefix: string = '!';
    public voice: GuildVoiceSettings = {
        volume: 50
    };
    public notifications: GuildNotificationSettings = {
        newYoutubeVideo: 'New video available! {{ link }}',
    };
}

type GuildVoiceSettings = {
    /**
     * The default volume for the bot when streaming music on a voice channel.
     * @default 50
     */
    volume: number;
}

type GuildNotificationSettings = {
    /**
     * The text to display when a member joins the guild, or undefined if not enabled by the guild's owner.
     */
    memberAdded?: string;

    /**
     * The text to display when a member leaves the guild, or undefined if not enabled by the guild's owner.
     */
    memberRemoved?: string;

    /**
     * The text to display when a new YouTube video is found on a watched channel.
     */
    newYoutubeVideo: string;
}
