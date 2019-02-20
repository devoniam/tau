import { Command, Input } from '@api';

export class Music extends Command {
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

    execute(input: Input) {
        let action = input.getArgument('action') as string;
        let options = input.getArgument('options') as string | undefined;

        input.channel.send('Not yet implemented.');
    }

    getUsage() : string {
        // Override for usage information.
        // If we return a string with multiple lines, the first line is the `command <usage> <info>`.
        // The rest of the lines are shown as help text below it - we can use this to document the actions.

        return super.getUsage();
    }
}
