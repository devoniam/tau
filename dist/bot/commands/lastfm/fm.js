"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class LastFm extends _api_1.Command {
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
        this.key = '87aa68ded7b81dc193520b678aff7da6';
    }
    async execute(input) {
        let db = input.member.settings;
        let action = input.getArgument('action');
        let user = input.getArgument('user');
        if (!user) {
            user = db.lastfmId;
        }
        switch (action) {
            case 'get':
                if (!user && user != '') {
                }
                break;
            case 'set':
                if (user && user != '') {
                    db.lastfmId = user;
                    input.channel.send('Lastfm username set to ' + user);
                }
                else {
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
exports.LastFm = LastFm;
//# sourceMappingURL=fm.js.map