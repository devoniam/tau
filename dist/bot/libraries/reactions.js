"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Reactions {
    static listen(message, fn) {
        let listener = new ReactionListener(() => {
            if (message.id in this.listening) {
                let index = this.listening[message.id].callbacks.indexOf(fn);
                if (index >= 0)
                    this.listening[message.id].callbacks.splice(index, 1);
                if (this.listening[message.id].callbacks.length == 0)
                    delete this.listening[message.id];
            }
        });
        if (message.id in this.listening) {
            this.listening[message.id].callbacks.push(fn);
            this.listening[message.id].expires = _.now() + 1800000;
        }
        this.listening[message.id] = {
            message: message,
            callbacks: [fn],
            expires: _.now() + 1800000
        };
        return listener;
    }
    static invoke(action, message, reaction, user) {
        if (message.id in this.listening) {
            this.listening[message.id].callbacks.forEach(fn => {
                fn({
                    action: action,
                    member: message.guild.members.get(user.id),
                    message: message,
                    emoji: reaction.emoji.toString()
                });
            });
        }
    }
    static async addReactions(message, emojis) {
        let promises = [];
        let fn = (i) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    message.reactCustom(emojis[i]).then(resolve, resolve);
                }, i * 320);
            });
        };
        for (let i = 0; i < emojis.length; i++) {
            promises.push(fn(i));
        }
        await Promise.all(promises);
    }
    static clean() {
        _.each(this.listening, (listening, id) => {
            if (listening.expires <= _.now()) {
                delete this.listening[id];
            }
        });
    }
}
Reactions.listening = {};
exports.Reactions = Reactions;
class ReactionListener {
    constructor(fn) {
        this.closeListener = fn;
    }
    close() {
        this.closeListener();
    }
}
exports.ReactionListener = ReactionListener;
function cleanup() {
    Reactions.clean();
    setTimeout(cleanup, 10000);
}
cleanup();
//# sourceMappingURL=reactions.js.map