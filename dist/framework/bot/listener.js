"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
class Listener {
    constructor() {
        this.logger = new logger_1.Logger('listener:' + this.constructor.name.toLowerCase());
    }
    getLogger() {
        return this.logger;
    }
    start() {
        let { Framework } = require('../framework');
        let client = Framework.client;
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
        client.on('guildCreate', async (guild) => {
            await guild.load();
            await this.run(this.onGuildCreate(guild));
        });
        client.on('guildDelete', async (guild) => {
            await guild.load();
            await this.run(this.onGuildDelete(guild));
        });
        client.on('guildMemberAdd', async (member) => {
            await member.load();
            await this.run(this.onGuildMemberAdd(member));
        });
        client.on('guildMemberAvailable', async (member) => {
            await member.load();
            await this.run(this.onGuildMemberAvailable(member));
        });
        client.on('guildMemberRemove', async (member) => {
            await member.load();
            await this.run(this.onGuildMemberRemove(member));
        });
        client.on('guildMemberUpdate', async (om, nm) => {
            await om.load();
            await nm.load();
            await this.run(this.onGuildMemberUpdate(om, nm));
        });
        client.on('guildMembersChunk', this.onGuildMembersChunk.bind(this));
        client.on('guildMemberSpeaking', this.onGuildMemberSpeaking.bind(this));
        client.on('guildUnavailable', this.onGuildUnavailable.bind(this));
        client.on('guildUpdate', this.onGuildUpdate.bind(this));
        client.on('message', async (message) => {
            await message.member.load();
            await message.guild.load();
            await this.run(this.onMessage(message));
        });
        client.on('messageDelete', async (message) => {
            await message.member.load();
            await message.guild.load();
            await this.run(this.onMessageDelete(message));
        });
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
    async run(r) {
        if (Promise.resolve(r) == r) {
            r.catch(err => {
                console.log(err);
            });
        }
    }
    onChannelCreate(channel) { }
    onChannelDelete(channel) { }
    onChannelPinsUpdate(channel, time) { }
    onChannelUpdate(oldChannel, newChannel) { }
    onDebug(info) { }
    onDisconnect(event) { }
    onEmojiCreate(emoji) { }
    onEmojiDelete(emoji) { }
    onEmojiUpdate(oldEmoji, newEmoji) { }
    onError(error) { }
    onGuildBanAdd(guild, user) { }
    onGuildBanRemove(guild, user) { }
    onGuildCreate(guild) { }
    onGuildDelete(guild) { }
    onGuildMemberAdd(member) { }
    onGuildMemberAvailable(member) { }
    onGuildMemberRemove(member) { }
    onGuildMembersChunk(members, guild) { }
    onGuildMemberSpeaking(member, speaking) { }
    onGuildMemberUpdate(oldMember, newMember) { }
    onGuildUnavailable(guild) { }
    onGuildUpdate(oldGuild, newGuild) { }
    onMessage(message) { }
    onMessageDelete(message) { }
    onMessageDeleteBulk(messages) { }
    onMessageReactionAdd(messageReaction, user) { }
    onMessageReactionRemove(messageReaction, user) { }
    onMessageReactionRemoveAll(message) { }
    onMessageUpdate(oldMessage, newMessage) { }
    onPresenceUpdate(oldMember, newMember) { }
    onRateLimit(rateLimitInfo) { }
    onReconnecting() { }
    onResume(replayed) { }
    onRoleCreate(role) { }
    onRoleDelete(role) { }
    onRoleUpdate(oldRole, newRole) { }
    onUserUpdate(oldUser, newUser) { }
    onVoiceStateUpdate(oldMember, newMember) { }
    onWarn(info) { }
}
exports.Listener = Listener;
//# sourceMappingURL=listener.js.map