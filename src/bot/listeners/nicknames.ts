import { Listener } from "@api";
import { Guild } from 'discord.js';
import { GuildMember } from "discord.js";

export class ExampleListener extends Listener {

    onGuildMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {

            // nickname changed
            newMember.settings.nameHistory.push({
                name: newMember.displayName,
                time: _.now()
            });
            newMember.settings.save();
        
    }
}