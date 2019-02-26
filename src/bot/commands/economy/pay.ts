import { Command, Input } from '@api';
import { GuildMember } from 'discord.js';
import { Emoji } from '@bot/libraries/emoji';
import { Economy } from '@bot/libraries/economy';

export class Pay extends Command {
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
                        if (message.member == (input as GuildMember)) return false;
                        if ((input as GuildMember).user.bot) return false;
                        return true;
                    }
                },
                {
                    name: 'amount',
                    constraint: 'number',
                    required: true,
                    eval: (input, args, message) => {
                        if (input <= 0) return false;
                        return true;
                    }
                }
            ]
        });
    }

    async execute(input: Input) {
        let user = input.getArgument('user') as GuildMember;
        let amount = input.getArgument('amount') as number;

        if (amount > input.member.settings.currency) {
            await input.channel.send(`${Emoji.ERROR}  Insufficient funds. The most you can send is **$${input.member.settings.currency.toFixed(2)}**.`);
            return;
        }

        await Promise.all([
            Economy.removeBalance(input.member, amount),
            Economy.addBalance(user, amount)
        ]);

        await input.channel.send(`${Emoji.SUCCESS}  Success! ${input.member} has sent **$${amount.toFixed(2)}** to ${user}.`);
    }
}
