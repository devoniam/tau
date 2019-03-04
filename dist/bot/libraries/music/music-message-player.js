"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MusicMessagePlayer {
    constructor(channel) {
        this.channel = channel;
    }
    async initialize() {
        await this.channel.send({ embed: {
                color: 3447003,
                title: "This is an embed",
                url: "http://google.com",
                description: "This is a test embed to showcase what they look like and what they can do.",
                fields: [{
                        name: "Fields",
                        value: "They can have different fields with small headlines."
                    },
                    {
                        name: "Masked links",
                        value: "You can put [masked links](http://google.com) inside of rich embeds."
                    },
                    {
                        name: "Markdown",
                        value: "You can put all the *usual* **__Markdown__** inside of them."
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: "© Example"
                }
            }
        });
    }
}
exports.MusicMessagePlayer = MusicMessagePlayer;
//# sourceMappingURL=music-message-player.js.map