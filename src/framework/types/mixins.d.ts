import { MemberBucket } from '@core/lib/database/member';
import { GuildBucket } from '@core/lib/database/guild';

declare module 'discord.js' {
    export interface Guild {
        settings: GuildBucket;
    }

    export interface GuildMember {
        settings: MemberBucket;
    }
}
