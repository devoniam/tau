"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const fs = require("fs");
const emoji_1 = require("@bot/libraries/emoji");
class Madlib extends _api_1.Command {
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
        this.games = {};
    }
    async execute(input) {
        if (input.channel.id in this.games) {
            let listener = this.games[input.channel.id];
            if (listener == null) {
                await input.channel.send(`${emoji_1.Emoji.ERROR}  The game is not accepting inputs at this time.`);
                return;
            }
            listener(input.getArgument('input'));
            return;
        }
        this.games[input.channel.id] = null;
        let libs = this.getLibs();
        let lib = _.sample(libs);
        let message = await input.channel.send(`:pencil:  **Title:** ${lib.title}`);
        let progress = '';
        for (let i = 0; i < lib.inputs.length; i++) {
            let variable = lib.inputs[i];
            await message.edit(`:pencil:  **Title:** ${lib.title}\nUsing \`${input.guild.settings.prefix}madlib <input>\`, please give me: ${variable.name + progress}`);
            let promise = new Promise(resolve => { this.games[input.channel.id] = resolve; });
            let value = await promise;
            this.games[input.channel.id] = null;
            lib.inputs[i].value = value;
            if (progress == '')
                progress = '\n\n';
            progress += emoji_1.Emoji.SUCCESS + ' ';
        }
        await message.delete();
        let story = lib.text;
        _.each(lib.inputs, variable => {
            story = story.replace(variable.occurrence, variable.value);
        });
        await input.channel.send(`:pencil:  **Title:** ${lib.title}\n\n${story}`);
        delete this.games[input.channel.id];
    }
    getLibs() {
        let madLibPath = pub('madlib.txt');
        let madLibText = fs.readFileSync(madLibPath).toString();
        let stories = madLibText.split('\n\n===\n\n');
        let libs = [];
        _.each(stories, story => {
            let titleRegex = /^#\s*(.+)$/gm;
            let inputRegex = /\(([\w\d\s,._'"+/?&#$*-]+)\)/g;
            let content = story.split('\n').slice(1).join('\n').trim();
            let lib = {
                title: '',
                text: content,
                inputs: []
            };
            let title = titleRegex.exec(story);
            if (title)
                lib.title = title[1];
            let input;
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
exports.Madlib = Madlib;
//# sourceMappingURL=madlib.js.map