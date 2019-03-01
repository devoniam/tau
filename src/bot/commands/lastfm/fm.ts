import { Command, Input } from '@api';

export class LastFm extends Command {

    private key: string = '87aa68ded7b81dc193520b678aff7da6';

    constructor() {
        super({
            name: 'lastfm',
            description: '',
            arguments: [
                {
                    name: 'action',
                    options: ['set', 'get', 'remove', 'album', 'artist', 'chart', 'artistchart', 'trackchart'],
                    default: 'get'
                },
                {
                    name: 'user',
                    constraint: 'string'
                }
            ]
        });
    }

    async execute(input: Input) {
        let db = input.member.settings;

        let action = input.getArgument('action') as string;
        let user = input.getArgument('user') as string | undefined;

        if (!user) {
            user = db.lastfmId;
        }

        switch(action) {
            case 'get':
                if (!user && user != '') {

                }
                break;
            case 'set':
                if (user && user != '') {
                    db.lastfmId = user;
                    input.channel.send('Lastfm username set to ' + user);
                } else {
                    input.channel.send('Please input a username');
                }
                break;
            case 'remove':
                db.lastfmId = '';
                input.channel.send('Lastfm username has been reset');
                break;
        }

        await db.save();
    }
}