"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const framework_1 = require("@core/framework");
const documentation_1 = require("@bot/libraries/documentation");
const discord_js_1 = require("discord.js");
class Help extends _api_1.Command {
    constructor() {
        super({
            name: 'help',
            description: 'Returns a list of commands.',
            arguments: [
                {
                    name: 'name',
                    description: 'The name of the command to see more details about.',
                    eval: name => {
                        return framework_1.Framework.findCommand(name) != null;
                    }
                }
            ]
        });
    }
    async execute(input) {
        let name = input.getArgument('name');
        if (name) {
            let command = framework_1.Framework.findCommand(name);
            await input.channel.send(documentation_1.Documentation.getCommandHelp(command));
            return;
        }
        let list = ':pencil:  **Commands:**\n\n';
        let commands = framework_1.Framework.getCommands();
        commands.forEach(command => {
            list += `_  _**→**  \`${command.getUsage()}\`  :  ${command.getDescription()}\n`;
        });
        let output = discord_js_1.Util.splitMessage(list.trim());
        for (let i = 0; i < output.length; i++) {
            await input.channel.send(output[i]);
        }
    }
}
exports.Help = Help;
//# sourceMappingURL=help.js.map