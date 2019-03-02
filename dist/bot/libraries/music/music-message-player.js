"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@core/framework");
class MusicMessagePlayer {
    constructor(channel) {
        this.channel = channel;
        this.status = Status.PLAYING;
        this.channel.send(this.populate()).then((r) => {
            this.playerMessage = r;
        });
    }
    populate(song) {
        let result = {
            embed: {
                color: 3447003,
                author: {
                    name: framework_1.Framework.getClient().user.username + " - Music player",
                    icon_url: framework_1.Framework.getClient().user.avatarURL
                },
                title: "**" + (song ? song.title : "This is an embed") + "**",
                url: song ? song.url : "http://google.com",
                description: "",
                fields: [
                    {
                        name: "Description",
                        value: song ? song.info.description.slice(0, 300) + "..." : "They can have different fields with small headlines."
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: "© Example"
                }
            }
        };
        return result;
    }
    async update(song) {
        if (this.playerMessage) {
            await this.playerMessage.edit(this.populate(song));
        }
    }
    async repost(song) {
        if (this.playerMessage) {
            await this.playerMessage.delete();
            this.playerMessage = await this.channel.send(this.populate(song));
        }
    }
}
exports.MusicMessagePlayer = MusicMessagePlayer;
var Status;
(function (Status) {
    Status["PLAYING"] = "playing";
    Status["PAUSED"] = "paused";
    Status["SKIPPING"] = "skipping";
})(Status = exports.Status || (exports.Status = {}));
//# sourceMappingURL=music-message-player.js.map