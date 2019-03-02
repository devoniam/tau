"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const events_1 = require("events");
const fs = require("fs");
const ytdl = require("ytdl-core");
class VideoDownloader extends events_1.EventEmitter {
    constructor(url, server) {
        super();
        url = url.replace(/^.+\.com\//, '');
        let dirPath = path.resolve(__dirname, server.guild.id);
        try {
            fs.mkdirSync(dirPath);
        }
        catch (err) {
            if (err.code !== 'EEXIST')
                throw err;
        }
        let output = path.resolve(dirPath, 'video.mp4');
        let video = ytdl(url, {});
        video.pipe(fs.createWriteStream(output));
        video.on('response', (res) => {
            let totalSize = res.headers['content-length'];
            let dataRead = 0;
            res.on('data', (data) => {
                dataRead += data.length;
                let percent = dataRead / totalSize;
                this.emit('progress', percent);
            });
            res.on('end', async () => {
                this.emit('complete', output, video);
            });
        });
    }
    ;
}
exports.VideoDownloader = VideoDownloader;
//# sourceMappingURL=video-download.js.map