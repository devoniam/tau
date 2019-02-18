import { MemberBucket } from '@libraries/database/buckets/member';
import { GuildBucket } from '@libraries/database/buckets/guild';

declare module 'discord.js' {
    export interface Guild {
        settings: GuildBucket;
    }

    export interface GuildMember {
        settings: MemberBucket;
    }
}
