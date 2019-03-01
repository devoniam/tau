import {Message, TextChannel} from "discord.js";

export class ProgressBar {
    private channel: TextChannel;
    private title: string;
    private maxChars: number;
    private sending: boolean;
    private message?: Message;
    private percentile: number;

    /***
     * @param {string} title
     * @param {TextChannel} channel
     */
    constructor(title: string, channel: TextChannel) {
        this.channel = channel;
        this.title = title;
        this.maxChars = 25;
        this.sending = false;
        this.percentile = 0;
    }

    private generateMessage(percent: number) {
        let loadedChars = Math.round(percent * this.maxChars);

        let result = ('=').repeat(loadedChars);
        if (loadedChars < this.maxChars) result += '>' + ' '.repeat(this.maxChars - loadedChars);

        return `${this.title}` +'\n```[' + result + ']```';
    }

    async initialize() {
        this.message = await this.channel.send(this.generateMessage(0)) as Message;

        let id = setInterval(async () => {
            if (!this.message) return;
            if (this.percentile < 1) {
                await this.message.edit(this.generateMessage(this.percentile));
            } else {
                clearInterval(id);
                await this.message.delete();
                return;
            }
        }, 500);
    }

    update(i: number, max?: number) {
        this.percentile = (max !== undefined) ? (i / max) : i;
    }
}