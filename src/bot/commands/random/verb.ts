import { Command, Input } from '@api';

const verbs = readPublicFile('random/verbs.txt').split(/\r?\n/);

export class Verb extends Command {
    constructor() {
        super({
            name: 'verb',
            description: 'Displays a random verb.'
        });
    }

    //TODO: Allow users/admins to enter custom quotes

    execute(input: Input) {
        let rnd = Math.floor(Math.random() * verbs.length);

        input.channel.send({
            embed:
            {
                color: 3447003,
                title: `**Verb** (#${1 + rnd})`,
                description: verbs[rnd]
            }
        });
    }
}
