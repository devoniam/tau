"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Music extends _api_1.Command {
    constructor() {
        super({
            name: 'music',
            description: 'Controls the bot\'s voice activity.',
            arguments: [
                {
                    name: 'action',
                    required: true,
                    options: ['play', 'stop', 'pause', 'resume', 'volume', 'queue', 'loop', 'autoplay', 'seek', 'lyrics']
                },
                {
                    name: 'options',
                    required: false,
                    expand: true
                }
            ]
        });
    }
    execute(input) {
        let action = input.getArgument('action');
        let options = input.getArgument('options');
        input.channel.send('Not yet implemented.');
    }
    getUsage() {
        return super.getUsage();
    }
}
exports.Music = Music;
