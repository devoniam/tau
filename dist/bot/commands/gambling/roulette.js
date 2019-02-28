"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const emoji_1 = require("@bot/libraries/emoji");
const Jimp = require("jimp");
const betting_1 = require("@bot/libraries/betting");
const reactions_1 = require("@bot/libraries/reactions");
const economy_1 = require("@bot/libraries/economy");
const sharp = require('sharp');
const randomNumber = require('random-number-csprng');
let base = sharp(pub('roulette/wheel.png'));
let pointer;
const tiles = [10, 5, 1, 2, 1, 5, 1, 10, 1, 2, 1, 20, 1, 2, 1];
class Roulette extends _api_1.Command {
    constructor() {
        super({
            name: 'roulette',
            description: 'Starts a game of wheel of fortune. If it lands on your number, your bet is multiplied by that number. If it doesn\'t, say goodbye to your cash.',
            aliases: ['spin', 'wheel', 'fortune']
        });
        Jimp.read(pub('roulette/pointer.png')).then(j => {
            pointer = j;
        });
    }
    async execute(input) {
        if (!betting_1.Betting.isGameAvailable(input.channel)) {
            input.channel.send(`${emoji_1.Emoji.ERROR}  Another gambling game is running in the same channel. Wait for it to complete.`);
            return;
        }
        let reservation = betting_1.Betting.reserve(input.channel);
        let landingTileIndex = await randomNumber(0, 14);
        let landingTileNumber = tiles[landingTileIndex];
        let spunWheel = await this.generateRotatedWheel(landingTileIndex * 24 + 12);
        let welcomeMessages = await this.welcome(input);
        let startTime = _.now();
        let countdownMessage = await input.channel.send(`_ _\n${emoji_1.Emoji.LOADING}  **Spinning** in 30 seconds...`);
        let bets = {};
        let listeners = [];
        reservation.on('bet', async (member, amount) => {
            let message = await input.channel.send(`:sparkles:  ${member} You are betting **$${amount.toFixed(2)}**. Please select the number to bet on.`);
            let listener = reactions_1.Reactions.listen(message, reaction => {
                if (reaction.member == member) {
                    let number = this.getReactionNumber(reaction.emoji);
                    if (number == 0)
                        return;
                    if (reaction.action == 'add') {
                        bets[member.id].number = number;
                        bets[member.id].message.edit(`:sparkles:  ${member} You are betting **$${amount.toFixed(2)}** on number **${number}**. Good luck!`);
                    }
                    else {
                        if (number == bets[member.id].number) {
                            bets[member.id].number = undefined;
                            bets[member.id].message.edit(`:sparkles:  ${member} You are betting **$${amount.toFixed(2)}**. Please select the number to bet on.`);
                        }
                    }
                }
            });
            listeners.push(listener);
            if (member.id in bets) {
                if (bets[member.id].message.deletable) {
                    await bets[member.id].message.delete();
                }
                delete bets[member.id];
            }
            bets[member.id] = {
                amount: amount,
                message: message,
                member: member
            };
            await reactions_1.Reactions.addReactions(message, [emoji_1.Emoji.SPIN_1, emoji_1.Emoji.SPIN_2, emoji_1.Emoji.SPIN_5, emoji_1.Emoji.SPIN_10, emoji_1.Emoji.SPIN_20]);
        });
        await this.countdown(countdownMessage, startTime);
        _.each(listeners, listener => {
            listener.close();
        });
        let validBets = 0;
        _.each(bets, bet => {
            if (bet.number)
                validBets++;
        });
        try {
            for (let id in bets) {
                await bets[id].message.delete();
            }
            await welcomeMessages[0].delete();
            await welcomeMessages[1].delete();
            await countdownMessage.delete();
        }
        catch (err) { }
        if (validBets == 0) {
            reservation.close();
            await input.channel.send([
                `${emoji_1.Emoji.ERROR}  There were no bets, so the game was cancelled.`
            ]);
            return;
        }
        await input.channel.send({ files: [spunWheel] });
        await input.channel.send([
            '_ _',
            `**The wheel landed on ${landingTileNumber}!**`,
            await this.calculateWinnersLosers(landingTileNumber, bets),
            '_ _'
        ]);
        for (let id in bets) {
            let bet = bets[id];
            if (bet.number) {
                if (bet.number == landingTileNumber) {
                    let amount = bet.amount + (bet.amount * landingTileNumber);
                    await economy_1.Economy.addBalance(bet.member, amount, input.channel);
                }
                else {
                    await economy_1.Economy.removeBalance(bet.member, bet.amount);
                }
            }
        }
        reservation.close();
    }
    async generateRotatedWheel(degrees) {
        degrees %= 360;
        let copy = base.clone().rotate(degrees, {
            background: '#ffffff00'
        });
        let buffer = await copy.toBuffer();
        let rotated = await Jimp.read(buffer);
        let canvas = new Jimp(200, 200, 0xffffff00);
        canvas.composite(rotated, Math.floor(-(rotated.bitmap.width / 2 - 100)), Math.floor(-(rotated.bitmap.height / 2 - 100)));
        canvas.composite(pointer, 0, 0);
        return await canvas.getBufferAsync(Jimp.MIME_PNG);
    }
    getReactionNumber(emoji) {
        switch (emoji) {
            case emoji_1.Emoji.SPIN_1: return 1;
            case emoji_1.Emoji.SPIN_2: return 2;
            case emoji_1.Emoji.SPIN_5: return 5;
            case emoji_1.Emoji.SPIN_10: return 10;
            case emoji_1.Emoji.SPIN_20: return 20;
        }
        return 0;
    }
    async welcome(input) {
        return [
            await input.channel.send([
                '**Wheel of Fortune**',
                'The following wheel will spin shortly. Place a bet on the number you think it will land on!',
                'If you are correct, your bet will be multiplied by that amount. If you are wrong, you lose your cash.',
                `To place a bet, use \`${input.guild.settings.prefix}bet <amount>\`. You will then be asked which number to bet on.`,
                '_ _'
            ].join('\n')),
            await input.channel.send({
                files: [await this.generateRotatedWheel(0)]
            })
        ];
    }
    async countdown(message, start) {
        let elapsed = (_.now() - start) / 1000;
        let remaining = Math.ceil(30 - elapsed);
        let fn = async () => {
            elapsed = (_.now() - start) / 1000;
            remaining = Math.ceil(30 - elapsed);
            if (remaining > 0) {
                await message.edit(`_ _\n${emoji_1.Emoji.LOADING}  **Spinning** in ${remaining} seconds...`);
            }
            else {
                await message.edit(`${emoji_1.Emoji.LOADING}  **Spinning** now...`);
            }
        };
        while (remaining > 0) {
            await sleep(Math.min(2000, remaining * 1000));
            await fn();
        }
    }
    async calculateWinnersLosers(number, bets) {
        let winners = [];
        let losers = [];
        let output = '';
        _.each(bets, bet => {
            if (bet.number) {
                if (bet.number == number)
                    winners.push(bet.member.toString());
                else
                    losers.push(bet.member.toString());
            }
        });
        if (winners.length == 0)
            return 'Everybody lost!';
        if (losers.length == 0)
            return 'Everybody won!';
        return `Winners: ${winners.join(', ')}\nLosers: ${losers.join(', ')}`;
    }
}
exports.Roulette = Roulette;
//# sourceMappingURL=roulette.js.map