import { MemberBucket } from '@core/lib/database/member';
import { GuildBucket } from '@core/lib/database/guild';

declare module 'discord.js' {
    export interface Guild {
        /**
         * A settings bucket for the guild, which stores its data for the bot. This will always be loaded
         * automatically when used within a command executor, but if you retrieved the guild elsewhere be sure to
         * check that it is loaded (by checking for existence).
         */
        settings: GuildBucket;

        /**
         * Returns the guild's default text channel. This one isn't deprecated. ;)
         */
        getDefaultChannel(): TextChannel;

        /**
         * Loads the settings bucket of the guild if not already loaded.
         */
        load(): Promise<void>;
    }

    export interface GuildMember {
        /**
         * A settings bucket for the guild member, which stores their data for the bot. This will always be loaded
         * automatically when used within a command executor, but if you retrieved the member elsewhere be sure to
         * check that it is loaded (by checking for existence).
         */
        settings: MemberBucket;

        /**
         * Loads the settings bucket of the member if not already loaded.
         */
        load(): Promise<void>;
    }

    export interface Message {
        /**
         * Automatically deletes the message after the specified number of milliseconds if it hasn't been deleted
         * already.
         *
         * **Note:** This is a custom method from the framework.
         */
        deleteAfter(ms: number): void;

        /**
         * Adds a custom emoji from the Emoji enum to the message given its string ID.
         *
         * **Note:** This is a custom method from the framework.
         */
        reactCustom(emoji: string): Promise<MessageReaction>;
    }
}
