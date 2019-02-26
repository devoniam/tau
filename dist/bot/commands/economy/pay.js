"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const emoji_1 = require("@bot/libraries/emoji");
const economy_1 = require("@bot/libraries/economy");
class Pay extends _api_1.Command {
    constructor() {
        super({
            name: 'pay',
            description: 'Pays the specified user.',
            arguments: [
                {
                    name: 'user',
                    constraint: 'mention',
                    required: true,
                    eval: (input, args, message) => {
                        if (message.member == input)
                            return false;
                        if (input.user.bot)
                            return false;
                        return true;
                    }
                },
                {
                    name: 'amount',
                    constraint: 'number',
                    required: true,
                    eval: (input, args, message) => {
                        if (input < 1)
                            return false;
                        return true;
                    }
                }
            ]
        });
    }
    async execute(input) {
        let user = input.getArgument('user');
        let amount = input.getArgument('amount');
        amount = Math.floor(amount);
        if (amount > input.member.settings.currency) {
            await input.channel.send(`${emoji_1.Emoji.ERROR}  Insufficient funds. The most you can send is **$${input.member.settings.currency.toFixed(2)}**.`);
            return;
        }
        await Promise.all([
            economy_1.Economy.removeBalance(input.member, amount),
            economy_1.Economy.addBalance(user, amount)
        ]);
        await input.channel.send(`${emoji_1.Emoji.SUCCESS}  Success! ${input.member} has sent **$${amount.toFixed(2)}** to ${user}.`);
    }
}
exports.Pay = Pay;
//# sourceMappingURL=pay.js.map