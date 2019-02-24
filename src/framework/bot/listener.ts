import { Client, Channel, Emoji, User, Guild, GuildMember, Message, Collection, Snowflake, MessageReaction, Role } from 'discord.js';
import { Logger } from './logger';

export class Listener {
    private logger: Logger;

    constructor() {
        this.logger = new Logger('listener:' + this.constructor.name.toLowerCase());
    }

    /**
     * Returns the logger instance for this command.
     */
    protected getLogger(): Logger {
        return this.logger;
    }

    /**
     * Starts the listener.
     */
    public start() {
        let { Framework } = require('../framework');
        let client = Framework.client as Client;

        client.on('channelCreate', this.onChannelCreate.bind(this));
        client.on('channelDelete', this.onChannelDelete.bind(this));
        client.on('channelPinsUpdate', this.onChannelPinsUpdate.bind(this));
        client.on('channelUpdate', this.onChannelUpdate.bind(this));
        client.on('debug', this.onDebug.bind(this));
        client.on('disconnect', this.onDisconnect.bind(this));
        client.on('emojiCreate', this.onEmojiCreate.bind(this));
        client.on('emojiDelete', this.onEmojiDelete.bind(this));
        client.on('emojiUpdate', this.onEmojiUpdate.bind(this));
        client.on('error', this.onError.bind(this));
        client.on('guildBanAdd', this.onGuildBanAdd.bind(this));
        client.on('guildBanRemove', this.onGuildBanRemove.bind(this));
        client.on('guildCreate', this.onGuildCreate.bind(this));
        client.on('guildDelete', this.onGuildDelete.bind(this));
        client.on('guildMemberAdd', async (member: GuildMember) => {
            await member.load();
            this.onGuildMemberAdd(member);
        });
        client.on('guildMemberAvailable', this.onGuildMemberAvailable.bind(this));
        client.on('guildMemberRemove', this.onGuildMemberRemove.bind(this));
        client.on('guildMembersChunk', this.onGuildMembersChunk.bind(this));
        client.on('guildMemberSpeaking', this.onGuildMemberSpeaking.bind(this));
        client.on('guildMemberUpdate', this.onGuildMemberUpdate.bind(this));
        client.on('guildUnavailable', this.onGuildUnavailable.bind(this));
        client.on('guildUpdate', this.onGuildUpdate.bind(this));
        client.on('message', async (message: Message) => {
            await message.member.load();
            this.onMessage(message);
        });
        client.on('messageDelete', this.onMessageDelete.bind(this));
        client.on('messageDeleteBulk', this.onMessageDeleteBulk.bind(this));
        client.on('messageReactionAdd', this.onMessageReactionAdd.bind(this));
        client.on('messageReactionRemove', this.onMessageReactionRemove.bind(this));
        client.on('messageReactionRemoveAll', this.onMessageReactionRemoveAll.bind(this));
        client.on('messageUpdate', this.onMessageUpdate.bind(this));
        client.on('presenceUpdate', this.onPresenceUpdate.bind(this));
        client.on('rateLimit', this.onRateLimit.bind(this));
        client.on('reconnecting', this.onReconnecting.bind(this));
        client.on('resume', this.onResume.bind(this));
        client.on('roleCreate', this.onRoleCreate.bind(this));
        client.on('roleDelete', this.onRoleDelete.bind(this));
        client.on('roleUpdate', this.onRoleUpdate.bind(this));
        client.on('userUpdate', this.onUserUpdate.bind(this));
        client.on('voiceStateUpdate', this.onVoiceStateUpdate.bind(this));
        client.on('warn', this.onWarn.bind(this));
    }

    /**
     * Emitted whenever a channel is created.
     * @param {Channel} channel The channel that was created
     */
    public onChannelCreate(channel: Channel): Promise<void> | void {}

    /**
     * Emitted whenever a channel is deleted.
     * @param {Channel} channel The channel that was deleted
     */
    public onChannelDelete(channel: Channel): Promise<void> | void {}

    /**
     * Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event, not much
     * information can be provided easily here - you need to manually check the pins yourself.
     *
     * @param {Channel} channel The channel that the pins update occured in
     * @param {Date} time The time of the pins update
     */
    public onChannelPinsUpdate(channel: Channel, time: Date): Promise<void> | void {}

    /**
     * Emitted whenever a channel is updated - e.g. name change, topic change.
     *
     * @prop {Channel} oldChannel The channel before the update
     * @prop {Channel} newChannel The channel after the update
     */
    public onChannelUpdate(oldChannel: Channel, newChannel: Channel): Promise<void> | void {}

    /**
     * Emitted for general debugging information.
     *
     * @prop {string} info The debug information
     */
    public onDebug(info: string): Promise<void> | void {}

    /**
     * Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
     *
     * @prop {CloseEvent} event The WebSocket close event
     */
    public onDisconnect(event: CloseEvent): Promise<void> | void {}

    /**
     * Emitted whenever a custom emoji is created in a guild.
     *
     * @prop {Emoji} emoji The emoji that was created
     */
    public onEmojiCreate(emoji: Emoji): Promise<void> | void {}

    /**
     * Emitted whenever a custom guild emoji is deleted.
     *
     * @prop {Emoji} emoji The emoji that was deleted
     */
    public onEmojiDelete(emoji: Emoji): Promise<void> | void {}

    /**
     * aaaaa
     *
     * @prop {Emoji} oldEmoji The old emoji
     * @prop {Emoji} newEmoji The new emoji
     */
    public onEmojiUpdate(oldEmoji: Emoji, newEmoji: Emoji): Promise<void> | void {}

    /**
     * Emitted whenever the client's WebSocket encounters a connection error.
     *
     * @prop {Error} error The encountered error
     */
    public onError(error: Error): Promise<void> | void {}

    /**
     * Emitted whenever a member is banned from a guild.
     *
     * @prop {Guild} guild The guild that the ban occurred in
     * @prop {User} user The user that was banned
     */
    public onGuildBanAdd(guild: Guild, user: User): Promise<void> | void {}

    /**
     * Emitted whenever a member is unbanned from a guild.
     *
     * @prop {Guild} guild The guild that the unban occurred in
     * @prop {User} user The user that was unbanned
     */
    public onGuildBanRemove(guild: Guild, user: User): Promise<void> | void {}

    /**
     * Emitted whenever the client joins a guild.
     *
     * @prop {Guild} guild The created guild
     */
    public onGuildCreate(guild: Guild): Promise<void> | void {}

    /**
     * Emitted whenever a guild is deleted/left.
     *
     * @prop {Guild} guild The guild that was deleted
     */
    public onGuildDelete(guild: Guild): Promise<void> | void {}

    /**
     * Emitted whenever a user joins a guild.
     *
     * @prop {GuildMember} member The member that has joined a guild
     */
    public onGuildMemberAdd(member: GuildMember): Promise<void> | void {}

    /**
     * Emitted whenever a member becomes available in a large guild.
     *
     * @prop {GuildMember} member The member that became available
     */
    public onGuildMemberAvailable(member: GuildMember): Promise<void> | void {}

    /**
     * Emitted whenever a member leaves a guild, or is kicked.
     *
     * @prop {GuildMember} member The member that has left/been kicked from the guild
     */
    public onGuildMemberRemove(member: GuildMember): Promise<void> | void {}

    /**
     * Emitted whenever a chunk of guild members is received (all members come from the same guild).
     *
     * @prop {GuildMember[]} members The members in the chunk
     * @prop {Guild} guild The guild related to the member chunk
     */
    public onGuildMembersChunk(members: GuildMember[], guild: Guild): Promise<void> | void {}

    /**
     * Emitted once a guild member starts/stops speaking.
     *
     * @prop {GuildMember} member The member that started/stopped speaking
     * @prop {boolean} speaking Whether or not the member is speaking
     */
    public onGuildMemberSpeaking(member: GuildMember, speaking: boolean): Promise<void> | void {}

    /**
     * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
     *
     * @prop {GuildMember} oldMember The member before the update
     * @prop {GuildMember} newMember The member after the update
     */
    public onGuildMemberUpdate(oldMember: GuildMember, newMember: GuildMember): Promise<void> | void {}

    /**
     * Emitted whenever a guild becomes unavailable, likely due to a server outage.
     *
     * @prop {Guild} guild The guild that has become unavailable
     */
    public onGuildUnavailable(guild: Guild): Promise<void> | void {}

    /**
     * Emitted whenever a guild is updated - e.g. name change.
     *
     * @prop {Guild} oldGuild The guild before the update
     * @prop {Guild} newGuild The guild after the update
     */
    public onGuildUpdate(oldGuild: Guild, newGuild: Guild): Promise<void> | void {}

    /**
     * Emitted whenever a message is created.
     *
     * @prop {Message} message The created message
     */
    public onMessage(message: Message): Promise<void> | void {}

    /**
     * Emitted whenever a message is deleted.
     *
     * @prop {Message} message The deleted message
     */
    public onMessageDelete(message: Message): Promise<void> | void {}

    /**
     * Emitted whenever messages are deleted in bulk.
     *
     * @prop {Collection<Snowflake, Message>} messages The deleted messages, mapped by their ID
     */
    public onMessageDeleteBulk(messages: Collection<Snowflake, Message>): Promise<void> | void {}

    /**
     * Emitted whenever a reaction is added to a cached message.
     *
     * @prop {MessageReaction} messageReaction The reaction object
     * @prop {User} user The user that applied the emoji or reaction emoji
     */
    public onMessageReactionAdd(messageReaction: MessageReaction, user: User): Promise<void> | void {}

    /**
     * Emitted whenever a reaction is removed from a cached message.
     *
     * @prop {MessageReaction} messageReaction The reaction object
     * @prop {User} user The user whose emoji or reaction emoji was removed
     */
    public onMessageReactionRemove(messageReaction: MessageReaction, user: User): Promise<void> | void {}

    /**
     * Emitted whenever all reactions are removed from a cached message.
     *
     * @prop {Message} message The message the reactions were removed from
     */
    public onMessageReactionRemoveAll(message: Message): Promise<void> | void {}

    /**
     * Emitted whenever a message is updated - e.g. embed or content change.
     *
     * @prop {Message} oldMessage The message before the update
     * @prop {Message} newMessage The message after the update
     */
    public onMessageUpdate(oldMessage: Message, newMessage: Message): Promise<void> | void {}

    /**
     * Emitted whenever a guild member's presence changes, or they change one of their details.
     *
     * @prop {GuildMember} oldMember The member before the presence update
     * @prop {GuildMember} newMember The member after the presence update
     */
    public onPresenceUpdate(oldMember: GuildMember, newMember: GuildMember): Promise<void> | void {}

    /**
     * Emitted when the client hits a rate limit while making a request
     *
     * @prop {RateLimitObject} rateLimitInfo Object containing the rate limit info
     */
    public onRateLimit(rateLimitInfo: RateLimitObject): Promise<void> | void {}

    /**
     * Emitted whenever the client tries to reconnect to the WebSocket.
     */
    public onReconnecting(): Promise<void> | void {}

    /**
     * Emitted whenever a WebSocket resumes.
     *
     * @prop {number} replayed The number of events that were replayed
     */
    public onResume(replayed: number): Promise<void> | void {}

    /**
     * Emitted whenever a role is created.
     *
     * @prop {Role} role The role that was created
     */
    public onRoleCreate(role: Role): Promise<void> | void {}

    /**
     * Emitted whenever a guild role is deleted.
     *
     * @prop {Role} role The role that was deleted
     */
    public onRoleDelete(role: Role): Promise<void> | void {}

    /**
     * Emitted whenever a guild role is updated.
     *
     * @prop {Role} oldRole The role before the update
     * @prop {Role} newRole The role after the update
     */
    public onRoleUpdate(oldRole: Role, newRole: Role): Promise<void> | void {}

    /**
     * Emitted whenever a user's details (e.g. username) are changed.
     *
     * @prop {User} oldUser The user before the update
     * @prop {User} newUser The user after the update
     */
    public onUserUpdate(oldUser: User, newUser: User): Promise<void> | void {}

    /**
     * Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
     *
     * @prop {GuildMember} oldMember The member before the voice state update
     * @prop {GuildMember} newMember The member after the voice state update
     */
    public onVoiceStateUpdate(oldMember: GuildMember, newMember: GuildMember): Promise<void> | void {}

    /**
     * Emitted for general warnings.
     *
     * @prop {string} info The warning
     */
    public onWarn(info: string): Promise<void> | void {}
}

type RateLimitObject = {
    /**
     * Number of requests that can be made to this endpoint
     */
    requestLimit: number;

    /**
     * Delta-T in ms between your system and Discord servers
     */
    timeDifference: number;

    /**
     * HTTP method used for request that triggered this event
     */
    method: string;

    /**
     * Path used for request that triggered this event
     */
    path: string;
};
