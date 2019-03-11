import { Command, Input } from '@api';
import { Framework } from '@core/framework';
import { Documentation } from '@bot/libraries/documentation';
import { Util, RichEmbed } from 'discord.js';

export let Sections : HelpSections = {
    'Basic': [ 'help', 'ping', 'uptime', 'changelog', 'invite' ],
    'Admin': [ 'prefix', 'clear', 'spam' ],
    'Economy': [ 'balance', 'daily', 'pay', 'richest', 'inventory' ],
    'Games': [ 'game', 'madlib', 'spin', 'race' ],
    'Social': [ 'level', 'rank', 'leaderboard', 'mock', 'rip', 'quote', 'breakice' ],
    'Utilities': [ 'music', 'weather', 'poll', 'avatar', 'nicknames', 'lastfm', 'flip', 'countdown' ],
    'Random': [ 'between', 'csv', '8ball', 'poem', 'pun', 'roll', 'trivia', 'user', 'inspire', 'noun', 'verb', 'adjective', 'adverb', 'twister', 'coinflip', 'fortune' ]
};

export class Help extends Command {
    constructor() {
        super({
            name: 'help',
            description: 'Returns a list of commands.',
            arguments: [
                {
                    name: 'name',
                    description: 'The name of the command to see more details about.',
                    eval: name => {
                        return Framework.findCommand(name) != null;
                    }
                }
            ]
        });
    }

    async execute(input: Input) {
        let name = input.getArgument('name') as string | undefined;

        if (name) {
            let command = Framework.findCommand(name) as Command;
            await input.channel.send(Documentation.getCommandHelp(command));
            return;
        }

        // Build the fields
        let fields : any[] = [];

        _.each(Sections, (commands, title) => {
            let o = '';

            _.each(commands, name => {
                o += '`' + name + '`  ';
            });

            fields.push({
                name: title,
                value: o.trimRight()
            });
        });

        // Build the embed
        let embed = new RichEmbed({
            description: 'The prefix for this server is `' + input.guild.settings.prefix + '`.',
            color: 0x1c7ed6,
            footer: { text: 'For detailed information about a command, use !help command or !command help.' },
            author: { name: 'Help' },
            fields: fields
        });

        await input.channel.send(embed);
    }
}

type HelpSections = { [name: string]: string[] };
