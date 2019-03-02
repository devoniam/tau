"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const Jimp = require("jimp");
const FS = require("fs");
class Rip extends _api_1.Command {
    constructor() {
        super({
            name: 'rip',
            aliases: ['ripe', 'rest_in_spaghetti'],
            description: 'Erect tombstone for fallen guild members.',
            arguments: [{
                    name: 'user',
                    description: 'the fallen one',
                    constraint: 'mention',
                    required: true
                }]
        });
    }
    async execute(input) {
        let fallen = input.getArgument('user');
        let tombstoneImageUrl = 'https://us.123rf.com/450wm/kellyvandellen/kellyvandellen1712/kellyvandellen171200166/92196178-empty-marble-gravestone-in-historic-cemetery-in-southern-usa.jpg?ver=6';
        let imageDirectory = './tombstone.png';
        let textColor = '0x666666ff';
        let textFont = Jimp.FONT_SANS_32_BLACK;
        let outputText = ':skull: F';
        let image = await Jimp.read(tombstoneImageUrl);
        let font = await Jimp.loadFont(textFont);
        this.AddTextToImage(image, font, fallen);
        this.WriteSendAndDeleteImage(image, imageDirectory, input, outputText);
    }
    AddTextToImage(image, font, fallen) {
        image.print(font, 0, 0, {
            text: fallen.displayName,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, image.getWidth(), image.getHeight());
    }
    ApplyTintToMessage(image, tintColor, tintIntensity) {
        image = image.color([
            { apply: 'mix', params: [tintColor, tintIntensity] }
        ]);
        return image;
    }
    WriteSendAndDeleteImage(image, imageDirectory, input, outputText) {
        image.writeAsync(imageDirectory).then(msg => {
            input.channel.send(outputText, {
                files: [
                    imageDirectory
                ]
            }).then(msg => {
                FS.unlinkSync(imageDirectory);
            });
        });
    }
}
exports.Rip = Rip;
//# sourceMappingURL=rip.js.map