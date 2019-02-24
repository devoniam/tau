"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const fs = require("fs");
const emoji_1 = require("@bot/libraries/emoji");
const sharp = require('sharp');
const GIFEncoder = require('gifencoder');
const Jimp = require('jimp');
const randomNumber = require('random-number-csprng');
let base = sharp(pub('roulette/wheel-base.png'));
let pointer;
let cache = {};
let target = 25;
const tiles = [1, 3, 1, 5, 1, 5, 3, 1, 10, 1, 3, 1, 5, 1, 3, 1, 20, 1, 3, 1, 5, 1, 3, 1, 10];
class Roulette extends _api_1.Command {
    constructor() {
        super({
            name: 'roulette',
            description: 'Starts a game of wheel of fortune. If it lands on your number, your bet is multiplied by that number. If it doesn\'t, say goodbye to your cash.',
            aliases: ['spin', 'wheel', 'fortune']
        });
    }
    async execute(input) {
        if (!pointer) {
            pointer = await Jimp.read(pub('roulette/pointer.png'));
        }
        let landingTileIndex = await randomNumber(0, 24);
        let landingTileNumber = tiles[landingTileIndex];
        let animationBufferPromise = this.createAnimation(landingTileIndex);
        let animationPath = tmp(`spinning-wheel-${_.now()}.gif`);
        let msg = await input.channel.send(`${emoji_1.Emoji.LOADING}  Preparing the wheel...`);
        let animationBuffer = await animationBufferPromise;
        fs.writeFileSync(animationPath, animationBuffer);
        msg.delete();
        await input.channel.send({
            file: animationPath
        });
        fs.unlinkSync(animationPath);
        setTimeout(() => {
            input.channel.send('Landed on ' + landingTileNumber);
        }, 3000);
    }
    async createAnimation(step) {
        let goal = ((step >= 11) ? 0 : 3600) + 72 + (step * 144);
        const encoder = new GIFEncoder(300, 300);
        let stream = encoder.createReadStream();
        let chunks = [];
        let promise = new Promise((resolve, reject) => {
            stream.on('end', resolve);
            stream.on('error', reject);
        });
        stream.on('readable', function () {
            let data;
            while (data = stream.read()) {
                chunks.push(data);
            }
        });
        encoder.start();
        encoder.setRepeat(-1);
        encoder.setDelay(70);
        encoder.setQuality(10);
        let rotation = 72;
        let slow = ((step >= 11) ? 0 : 3600) + 72 + (step * 144) - (72 * 6);
        let slow2 = ((step >= 11) ? 0 : 3600) + 72 + (step * 144) - (72 * 4);
        let slow3 = ((step >= 11) ? 0 : 3600) + 72 + (step * 144) - (72 * 2);
        encoder.addFrame(await this.generateRotatedWheel(7.2));
        while (rotation < goal) {
            rotation += 72;
            let times = 1;
            if (rotation >= slow)
                times = 2;
            if (rotation >= slow2)
                times = 3;
            if (rotation >= slow3)
                times = 5;
            for (let i = 0; i < times; i++) {
                encoder.addFrame(await this.generateRotatedWheel(rotation / 10));
            }
        }
        encoder.finish();
        await promise;
        return Buffer.concat(chunks);
    }
    async generateRotatedWheel(degrees) {
        degrees %= 360;
        if (cache[degrees]) {
            return cache[degrees];
        }
        let copy = base.clone().rotate(degrees, {
            background: '#ffffff00'
        });
        let buffer = await copy.toBuffer();
        let rotated = await Jimp.read(buffer);
        let canvas = new Jimp(300, 300, 0x36393fff);
        canvas.composite(rotated, Math.floor(-(rotated.bitmap.width / 2 - 150)), Math.floor(-(rotated.bitmap.height / 2 - 150)));
        canvas.composite(pointer, 0, 0);
        cache[degrees] = canvas.bitmap.data;
        return canvas.bitmap.data;
    }
}
exports.Roulette = Roulette;
//# sourceMappingURL=roulette.js.map