import { Command, Input } from '@api';

const puns = readPublicFile('random/puns.txt').split(/\r?\n/);

export class Pun extends Command {
    constructor() {
        super({
            name: 'pun',
            description: 'Displays a random pun.'
        });
    }

    //TODO: Allow users/admins to enter custom puns

    execute(input: Input) {
        let rnd = Math.floor(Math.random() * puns.length);

        input.channel.send({
            embed:
            {
                color: 3447003,
                title: `**Pun** (#${1 + rnd})`,
                description: puns[rnd]
            }
        });
    }
}
