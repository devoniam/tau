"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProgressBar {
    constructor(title, channel) {
        this.channel = channel;
        this.title = title;
        this.maxChars = 25;
        this.sending = false;
        this.percentile = 0;
    }
    generateMessage(percent) {
        let loadedChars = Math.round(percent * this.maxChars);
        let result = ('=').repeat(loadedChars);
        if (loadedChars < this.maxChars)
            result += '>' + ' '.repeat(this.maxChars - loadedChars);
        return `${this.title}` + '\n```[' + result + ']```';
    }
    async initialize() {
        this.message = await this.channel.send(this.generateMessage(0));
        let id = setInterval(async () => {
            if (!this.message)
                return;
            if (this.percentile < 1) {
                await this.message.edit(this.generateMessage(this.percentile));
            }
            else {
                clearInterval(id);
                await this.message.delete();
                return;
            }
        }, 500);
    }
    update(i, max) {
        this.percentile = (max !== undefined) ? (i / max) : i;
    }
}
exports.ProgressBar = ProgressBar;
//# sourceMappingURL=progress-bar.js.map