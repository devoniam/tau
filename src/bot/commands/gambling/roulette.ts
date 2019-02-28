import { Command, Input } from "@api";
import { Emoji } from "@bot/libraries/emoji";
import * as Jimp from 'jimp';
import { Betting } from "@bot/libraries/betting";
import { Message } from "discord.js";
import { Reactions } from "@bot/libraries/reactions";

const sharp = require('sharp');
const randomNumber = require('random-number-csprng');

let base = sharp(pub('roulette/wheel.png'));
let pointer : any;

const tiles = [10, 5, 1, 2, 1, 5, 1, 10, 1, 2, 1, 20, 1, 2, 1];

export class Roulette extends Command {
    constructor() {
        super({
            name: 'roulette',
            description: 'Starts a game of wheel of fortune. If it lands on your number, your bet is multiplied by that number. If it doesn\'t, say goodbye to your cash.',
            aliases: ['spin', 'wheel', 'fortune']
        });

        // Preload the pointer image via Jimp
        Jimp.read(pub('roulette/pointer.png')).then(j => {
            pointer = j;
        });
    }

    async execute(input: Input) {
        // Check if there is another gambling game ongoing
        if (!Betting.isGameAvailable(input.channel)) {
            input.channel.send(`${Emoji.ERROR}  Another gambling game is running in the same channel. Wait for it to complete.`);
            return;
        }

        // Reserve the channel
        let reservation = Betting.reserve(input.channel);

        // Pick where the wheel will spin to
        let landingTileIndex = await randomNumber(0, 14);
        let landingTileNumber = tiles[landingTileIndex];
        let startWheel = await this.generateRotatedWheel(0);
        let spunWheel = await this.generateRotatedWheel(landingTileIndex * 24 + 12);

        // Send game welcome message
        await input.channel.send([
            '**Wheel of Fortune**',
            'The following wheel will spin shortly. Place a bet on the number you think it will land on!',
            'If you are correct, your bet will be multiplied by that amount. If you are wrong, you lose your cash.',
            `To place a bet, use \`${input.guild.settings.prefix}bet <amount>\`. You will then be asked which number to bet on.`,
            '_ _'
        ].join('\n'), { files: [startWheel] });

        // Send countdown
        let countdownMessage = await input.channel.send(`_ _\n${Emoji.LOADING}  **Spinning** in 30 seconds...`);

        // Listen for bets
        let bets : {[id: string]: Bet} = {};

        reservation.on('bet', async (member, amount) => {
            let message = await input.channel.send(`:sparkles:  ${member} You are betting **$${amount.toFixed(2)}**. Please select the number to bet on.`) as Message;
            let listener = Reactions.listen(message, reaction => {
                if (reaction.member == member) {
                    let number = this.getReactionNumber(reaction.emoji);
                    if (number == 0) return;

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

            if (member.id in bets) {
                if (bets[member.id].message.deletable) {
                    await bets[member.id].message.delete();
                }

                delete bets[member.id];
            }

            bets[member.id] = {
                amount: amount,
                message: message
            };

            await Reactions.addReactions(message, [Emoji.SPIN_1, Emoji.SPIN_2, Emoji.SPIN_5, Emoji.SPIN_10, Emoji.SPIN_20]);
        });
    }

    /**
     * Returns the buffer for a transparent PNG image of the spinning wheel with the specified degrees of rotation.
     */
    private async generateRotatedWheel(degrees: number) {
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

    private getReactionNumber(emoji: string) : number {
        switch (emoji) {
            case Emoji.SPIN_1: return 1;
            case Emoji.SPIN_2: return 2;
            case Emoji.SPIN_5: return 5;
            case Emoji.SPIN_10: return 10;
            case Emoji.SPIN_20: return 20;
        }

        return 0;
    }
}

type Bet = {
    amount: number;
    number?: number;
    message: Message;
};
