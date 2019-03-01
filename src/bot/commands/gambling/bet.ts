import { Command, Input } from "@api";
import { Emoji } from "@bot/libraries/emoji";
import { Betting } from "@bot/libraries/betting";

export class Bet extends Command {
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

    async execute(input: Input) {
        let amount = Math.floor(input.getArgument('amount') as number);
        let available = input.member.settings.currency;

        if (amount <= 0) {
            await input.channel.send(`${Emoji.ERROR}  Enter an amount greater than $0.00.`);
            return;
        }

        if (amount > available) {
            await input.channel.send(`${Emoji.ERROR}  You do not have enough currency for that bet.`);
            return;
        }

        try {
            Betting.placeBet(input.channel, input.member, amount);
        }
        catch (error) {
            await input.channel.send(`${Emoji.ERROR}  ${error.message}`);
        }
    }
}
