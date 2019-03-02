import { Command, Input } from '@api';
import * as fs from 'fs';
import { Message } from 'discord.js';
import { Emoji } from '@bot/libraries/emoji';

export class Madlib extends Command {
    private games : {[channelId: string]: ((input: string) => void) | null} = {};

    constructor() {
        super({
            name: 'madlib',
            description: 'Fill in the words with your guildmates, and get a hilarious text in return.',
            arguments: [
                {
                    name: 'input',
                    expand: true
                }
            ]
        });
    }

    async execute(input: Input) {
        // Send input to an existing game
        if (input.channel.id in this.games) {
            let listener = this.games[input.channel.id];

            if (listener == null) {
                await input.channel.send(`${Emoji.ERROR}  The game is not accepting inputs at this time.`);
                return;
            }

            listener(input.getArgument('input') as string);
            return;
        }

        // Start a game
        this.games[input.channel.id] = null;

        let libs = this.getLibs();
        let lib = _.sample(libs) as Lib;
        let message = await input.channel.send(`:pencil:  **Title:** ${lib.title}`) as Message;
        let progress = '';

        for (let i = 0; i < lib.inputs.length; i++) {
            let variable = lib.inputs[i];
            await message.edit(`:pencil:  **Title:** ${lib.title}\nUsing \`${input.guild.settings.prefix}madlib <input>\`, please give me: ${variable.name + progress}`);

            let promise : Promise<string> = new Promise(resolve => { this.games[input.channel.id] = resolve; });
            let value = await promise;
            this.games[input.channel.id] = null;

            lib.inputs[i].value = value;

            if (progress == '') progress = '\n\n';
            progress += Emoji.SUCCESS + ' ';
        }

        await message.delete();

        let story = lib.text;
        _.each(lib.inputs, variable => {
            story = story.replace(variable.occurrence, variable.value as string);
        });

        await input.channel.send(`:pencil:  **Title:** ${lib.title}\n\n${story}`);
        delete this.games[input.channel.id];
    }

    private getLibs() {
        let madLibPath = pub('madlib.txt');
        let madLibText = fs.readFileSync(madLibPath).toString();
        let stories = madLibText.replace(/\r\n/, '\n').split('\n\n===\n\n');
        let libs : Lib[] = [];

        _.each(stories, story => {
            let titleRegex = /^#\s*(.+)$/gm;
            let inputRegex = /\(([\w\d\s,._'"+/?&#$*-]+)\)/g;
            let content = story.split('\n').slice(1).join('\n').trim();
            let lib : Lib = {
                title: '',
                text: content,
                inputs: []
            };

            // Extract title
            let title = titleRegex.exec(story);
            if (title) lib.title = title[1];

            // Extract inputs
            let input : RegExpExecArray | null;
            while ((input = inputRegex.exec(content)) != null) {
                if (input.index === inputRegex.lastIndex) {
                    inputRegex.lastIndex++;
                }

                let snippet = input[1];

                lib.inputs.push({
                    name: snippet,
                    occurrence: `(${snippet})`
                });
            }

            libs.push(lib);
        });

        return libs;
    }
}

type Lib = {
    title: string;
    text: string;
    inputs: {
        name: string;
        occurrence: string;
        value?: string;
    }[];
}
