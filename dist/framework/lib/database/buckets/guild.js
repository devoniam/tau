"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bucket_1 = require("../bucket");
class GuildBucket extends bucket_1.Bucket {
    constructor() {
        super(...arguments);
        this.table = 'guilds';
        this.prefix = '!';
        this.voice = {
            volume: 50
        };
        this.notifications = {
            newYoutubeVideo: 'New video available! {{ link }}',
        };
    }
}
exports.GuildBucket = GuildBucket;
