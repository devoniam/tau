"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const moment = require('moment');
class Nicknames extends _api_1.Command {
    constructor() {
        super({
            name: 'nicknames',
            description: 'Display the nickname history for the specified user.',
            arguments: [
                {
                    name: 'user',
                    constraint: 'mention',
                    default: '@member',
                    error: true
                }
            ]
        });
    }
    execute(input) {
        let target = input.getArgument('user');
        let result = '';
        input.member.settings.nameHistory.forEach(record => {
            let timeAgo = _.now() - record.time;
            let m = moment(record.time);
            let isThisYear = (m.format('YYYY') === moment().format('YYYY'));
            let timestamp = (timeAgo < (86400 * 7 * 1000)) ? m.fromNow() :
                ((isThisYear) ? m.format('MMMM Do h:mm a') :
                    m.format('MMMM Do YYYY h:mm a'));
            result += record.name + ' 󠀀󠀀 󠀀󠀀󠀀󠀀· 󠀀󠀀 󠀀󠀀';
            result += timestamp + '\n';
        });
        if (input.member.settings.nameHistory.length <= 0) {
            result = "None";
        }
        input.channel.send({
            embed: {
                color: 3447003,
                author: {
                    name: target.displayName,
                    icon_url: target.user.avatarURL
                },
                title: "Nicknames",
                description: result
            }
        });
    }
}
exports.Nicknames = Nicknames;
//# sourceMappingURL=nicknames.js.map