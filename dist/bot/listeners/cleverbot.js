"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const framework_1 = require("@core/framework");
const CleverbotAPI = require('cleverbot-api');
let cleverbot;
class CleverbotListener extends _api_1.Listener {
    onMessage(message) {
        let myId = framework_1.Framework.getClient().user.id;
        let exp = new RegExp('^<@!?' + myId + '>\\s+(.+)$');
        let matches = exp.exec(message.content);
        if (matches) {
            let content = matches[1];
            if (!cleverbot) {
                let key = framework_1.Framework.getConfig().authentication.cleverbot.key;
                if (!key) {
                    this.getLogger().error('Cleverbot is not configured on this bot. To activate it, enter an API key.');
                    return;
                }
                cleverbot = new CleverbotAPI(key);
            }
            message.channel.startTyping();
            cleverbot.getReply({
                input: content
            }, (error, response) => {
                if (error) {
                    this.getLogger().error('Error occurred when running cleverscript:');
                    this.getLogger().error(error);
                    message.channel.stopTyping();
                    return;
                }
                setTimeout(() => {
                    message.channel.stopTyping();
                    message.channel.send(':speech_balloon:  ' + response.output);
                }, 1000);
            });
        }
    }
}
exports.CleverbotListener = CleverbotListener;
//# sourceMappingURL=cleverbot.js.map