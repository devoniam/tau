import { Listener } from "@api";
import { Message } from "discord.js";

export let ChatLogStatus = {
    active: false
};

export class ChatLog extends Listener
{
    onMessage(message: Message) {
        if (ChatLogStatus.active) {
            if (message.content) {
                this.getLogger().info(`${message.member.user.tag}: ${message.content}`);
            }
        }
    }
}
