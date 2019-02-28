"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Betting {
    static isGameAvailable(channel) {
        return !(channel.id in this.listeners);
    }
    static getListener(channel) {
        if (channel.id in this.listeners) {
            return this.listeners[channel.id];
        }
    }
    static placeBet(channel, member, amount) {
        if (!(channel.id in this.listeners)) {
            throw new Error('There are currently no games in this channel to bet on.');
        }
        this.listeners[channel.id].trigger(member, amount);
    }
    static reserve(channel) {
        let listener = new BettingListener(() => {
            if (channel.id in this.listeners) {
                delete this.listeners[channel.id];
            }
        });
        setTimeout(() => {
            if (channel.id in this.listeners) {
                if (this.listeners[channel.id] == listener) {
                    listener.close();
                }
            }
        }, 300000);
        this.listeners[channel.id] = listener;
        return listener;
    }
}
Betting.listeners = {};
exports.Betting = Betting;
class BettingListener {
    constructor(fn) {
        this.listeners = [];
        this.closeListener = fn;
    }
    on(event, fn) {
        this.listeners.push(fn);
    }
    trigger(member, amount) {
        this.listeners.forEach(listener => {
            listener(member, amount);
        });
    }
    close() {
        this.listeners = [];
        this.closeListener();
    }
}
exports.BettingListener = BettingListener;
//# sourceMappingURL=betting.js.map