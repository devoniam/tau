import * as fs from 'fs';
import * as path from 'path';
import { Framework } from '@core/framework';
import { GuildMember } from 'discord.js';

type MemberMigrationRow = {
    guild: string;
    member: string;
    names: {
        name: string;
        time: number;
    }[];
    level: number;
    experience: number;
    currency: number;
};

async function transfer() {
    const logger = Framework.getLogger();
    logger.info('Starting data migration.');

    // Load the transfer data
    const data = JSON.parse(fs.readFileSync('transfer.json').toString()) as MemberMigrationRow[];
    logger.info('Loaded migration file with', data.length, 'members.');

    // Iterate
    for (let index = 0; index < data.length; index++) {
        let row = data[index];

        // Get guild
        let guild = Framework.getClient().guilds.get(row.guild);
        if (!guild) continue;

        // Get member
        let member = guild.members.get(row.member) as GuildMember;
        if (!member) continue;

        // Skip bots (old framework sometimes indexed them)
        if (member.user.bot) continue;

        // Wait for bucket load
        await member.load();

        // Migrate data
        member.settings.currency += row.currency;
        member.settings.experience += row.experience;
        member.settings.level = row.level;

        // Migrate names
        row.names.forEach(entry => {
            member.settings.nameHistory.push({
                name: entry.name,
                time: entry.time
            });
        });

        // Save migrated settings
        member.settings.save();

        logger.info('Migrated', member.user.tag, 'in guild', guild.name);
    };
}

if (fs.existsSync('transfer.json')) {
    transfer();
}

