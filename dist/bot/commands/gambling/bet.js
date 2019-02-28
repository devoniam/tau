"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const emoji_1 = require("@bot/libraries/emoji");
const betting_1 = require("@bot/libraries/betting");
class Bet extends _api_1.Command {
    constructor() {
        super({
            name: 'bet',
            description: 'Places a bet on an ongoing gambling game.',
            arguments: [
                {
                    name: 'amount',
                    description: 'The amount of currency to gamble.',
                    constraint: 'number',
                    required: true
                }
            ]
        });
    }
    async execute(input) {
        let amount = Math.floor(input.getArgument('amount'));
        let available = input.member.settings.currency;
        if (amount <= 0) {
            await input.channel.send(`${emoji_1.Emoji.ERROR}  Enter an amount greater than $0.00.`);
            return;
        }
        if (amount > available) {
            await input.channel.send(`${emoji_1.Emoji.ERROR}  You do not have enough currency for that bet.`);
            return;
        }
        try {
            betting_1.Betting.placeBet(input.channel, input.member, amount);
        }
        catch (error) {
            await input.channel.send(`${emoji_1.Emoji.ERROR}  ${error.message}`);
        }
    }
}
exports.Bet = Bet;
//# sourceMappingURL=bet.js.map