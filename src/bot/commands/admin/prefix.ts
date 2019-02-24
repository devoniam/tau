import { Command, Input } from '@api';
import { Emoji } from '@bot/libraries/emoji';

export class Prefix extends Command {
    constructor() {
        super({
            name: 'prefix',
            description: 'Changes the prefix for the bot for a server.',
            permission: 'administrator',
            arguments: [
                {
                    name: 'char',
                    description: 'A new single character to use as the prefix.',
                    options: ['!', '@', '#', '$', '%', '^', '&', '*', '<', '>', ',', '.', '/', '?', ':', ';', '|', '~', '`', '=', '+', '-'],
                    usage: 'character',
                    required: true
                }
            ]
        });
    }

    async execute(input: Input) {
        let char = input.getArgument('char') as string;
        let settings = input.guild.settings;

        // Set the new prefix
        settings.prefix = char;
        await settings.save();

        // Confirm
        input.channel.send(Emoji.SUCCESS + '  Your custom prefix has been set. Now give it a try!');
    }
}
