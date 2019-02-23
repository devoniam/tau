"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Quote extends _api_1.Command {
    constructor() {
        super({
            name: 'quote',
            description: 'Manages saved quotes for the server.',
            arguments: [
                {
                    name: 'action',
                    options: ['add', 'remove', 'delete', 'get'],
                    default: 'get'
                },
                {
                    name: 'user',
                    constraint: 'mention',
                    error: true
                },
                {
                    name: 'id',
                    constraint: 'number'
                },
                {
                    name: 'quote'
                }
            ]
        });
    }
    async execute(input) {
        let db = input.guild.settings;
        let action = input.getArgument('action');
        let user = input.getArgument('user');
        let id = input.getArgument('id');
        let quote = input.getArgument('quote');
        switch (action) {
            case 'add':
                if (user) {
                    if (!quote) {
                        let q = await this.getLastMessage(input.channel, user);
                        if (q)
                            quote = q.content;
                    }
                    if (quote) {
                        db.quotes.push({
                            memberId: user.id,
                            time: _.now(),
                            message: quote
                        });
                        input.channel.send('**[' + (db.quotes.length).toString() + ']** - ' + quote + ' —' + user.displayName);
                    }
                    else {
                        input.channel.send("No quote to add");
                    }
                }
                else {
                    if (!quote) {
                        input.channel.send("No quote to add");
                    }
                    db.quotes.push({
                        memberId: '0',
                        time: _.now(),
                        message: quote
                    });
                    input.channel.send('**[' + (db.quotes.length).toString() + ']** - ' + quote + ' —Anonymous');
                }
                break;
            case 'remove':
            case 'delete':
                if (id != null) {
                    let q = db.quotes[id - 1];
                    if (q) {
                        let member;
                        if (input.guild.member(q.memberId)) {
                            member = input.guild.member(q.memberId).displayName;
                        }
                        else {
                            member = "Anonymous";
                        }
                        db.quotes.splice(id - 1, 1);
                        input.channel.send(`Quote **[` + id.toString() + `]** from ` + member + ` removed.`);
                    }
                    else {
                        input.channel.send("That quote does not exist");
                    }
                }
                else {
                    input.channel.send("Please provide the quote ID");
                }
                break;
            case 'get':
                if (_.size(db.quotes) > 0) {
                    if (user) {
                        let userQuotes = _.filter(db.quotes, function (o) { return o.memberId == user.id; });
                        let id = _.random(0, _.size(userQuotes) - 1);
                        input.channel.send('**[' + (db.quotes.indexOf(userQuotes[id]) + 1).toString() + ']** - ' + userQuotes[id].message + ' —' + user.displayName);
                    }
                    else {
                        let id = _.random(0, _.size(db.quotes) - 1);
                        let member;
                        if (input.guild.member(db.quotes[id].memberId)) {
                            member = input.guild.member(db.quotes[id].memberId).displayName;
                        }
                        else {
                            member = "Anonymous";
                        }
                        input.channel.send('**[' + (id + 1).toString() + ']** - ' + db.quotes[id].message + ' —' + member);
                    }
                }
                else {
                    input.channel.send('No quotes saved.');
                }
                break;
        }
        await db.save();
    }
    async getLastMessage(channel, member) {
        let messages = await channel.fetchMessages({ limit: 100, before: channel.lastMessageID });
        let last = _.find(messages.array(), (msg) => {
            return msg.member == member && !msg.content.startsWith(channel.guild.settings.prefix);
        });
        return last;
    }
}
exports.Quote = Quote;
//# sourceMappingURL=quote.js.map