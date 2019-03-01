import { Channel } from "discord.js";
import { GuildMember } from "discord.js";

export class Betting {
    private static listeners: {[id: string]: BettingListener} = {};

    /**
     * Checks if the channel is available for a gambling game.
     */
    public static isGameAvailable(channel: Channel) : boolean {
        return !(channel.id in this.listeners);
    }

    /**
     * Returns the listener for the given channel, or `undefined` if one does not exist.
     */
    public static getListener(channel: Channel) : BettingListener | undefined {
        if (channel.id in this.listeners) {
            return this.listeners[channel.id];
        }
    }

    /**
     * Places a bid for the given member in the given channel. Throws an error if something is wrong. The error
     * message should be shown to the member.
     */
    public static placeBet(channel: Channel, member: GuildMember, amount: number) {
        if (!(channel.id in this.listeners)) {
            throw new Error('There are currently no games in this channel to bet on.');
        }

        this.listeners[channel.id].trigger(member, amount);
    }

    /**
     * Reserves the channel for a gambling game and returns the listener.
     */
    public static reserve(channel: Channel) : BettingListener {
        // Create a betting listener
        let listener = new BettingListener(() => {
            if (channel.id in this.listeners) {
                delete this.listeners[channel.id];
            }
        });

        // Handle cases where the gambling minigame may crash and leave a permanent listener
        setTimeout(() => {
            if (channel.id in this.listeners) {
                if (this.listeners[channel.id] == listener) {
                    listener.close();
                }
            }
        }, 300000);

        // Add the listener
        this.listeners[channel.id] = listener;

        // All done
        return listener;
    }
}

export class BettingListener {
    private listeners: ((member: GuildMember, amount: number) => any)[] = [];
    private closeListener: () => any;

    constructor(fn: () => any) {
        this.closeListener = fn;
    }

    /**
     * Listens for incoming bets from the betting manager.
     */
    public on(event: 'bet', fn: (member: GuildMember, amount: number) => any) {
        this.listeners.push(fn);
    }

    /**
     * Triggers a bet and fires all listeners.
     */
    public trigger(member: GuildMember, amount: number) {
        this.listeners.forEach(listener => {
            listener(member, amount);
        });
    }

    /**
     * Closes the listener, ends the game, and stops bidding.
     */
    public close() {
        this.listeners = [];
        this.closeListener();
    }
}
