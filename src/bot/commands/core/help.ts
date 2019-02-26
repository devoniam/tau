import { Command, Input } from '@api';
import { Framework } from '@core/framework';
import { Documentation } from '@bot/libraries/documentation';
import { Util } from 'discord.js';

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

        let list = ':pencil:  **Commands:**\n\n';
        let commands = Framework.getCommands();

        commands.forEach(command => {
            list += `_  _**→**  \`${command.getUsage()}\`  :  ${command.getDescription()}\n`;
        });

        let output = Util.splitMessage(list.trim());
        for (let i = 0; i < output.length; i++) {
            await input.channel.send(output[i]);
        }
    }
}
