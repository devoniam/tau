import { Command, Input } from '@api';
import * as pretty from "@libraries/prettify-ms";
import {Economy} from "@libraries/economy";

export class Redeem extends Command {
    constructor() {
        super({
            name: 'redeem',
            aliases: ['daily'],
            description: 'Try your luck at a random amount of free daily currency and/or items.'
        });
    }

    async execute(input: Input) {
        let lastTime = input.member.settings.lastDailyRedeemTime;

        if (lastTime < (_.now() - 86400000)) {
            let amount = _.random(5, (_.random(1, 50) === 1) ? 150 : 15);

            input.member.settings.lastDailyRedeemTime = _.now();

            await Economy.addBalance(input.member, amount);
            let formatted = amount.toFixed(2);
            await input.channel.send(`:moneybag:  ${input.member} received **$${formatted}**.`);
        }
        else {
            let remaining = pretty.prettify((lastTime + 86400000) - _.now());
            await input.channel.send(`:x:  Try again in ${remaining}.`);
        }
    }
}
