import { Command, Input } from '@api';

export class TicTacToe extends Command {
    constructor() {
        super({
            name: 'tictactoe',
            aliases: ['tic', 'ttt'],
            description: 'Play a game of tic tac toe with another user.',
            arguments: [
                {
                    name: 'action',
                    required: true,
                    options: ['start', 'join']
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
}
