"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SongInfo {
    constructor(title, info, requester, textChannel) {
        this.title = title;
        this.info = info;
        this.url = this.info.video_url;
        this.requester = requester;
        this.textChannel = textChannel;
    }
}
exports.SongInfo = SongInfo;
//# sourceMappingURL=song-info.js.map