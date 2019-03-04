import { Command, Input } from '@api';
import { GuildMember} from 'discord.js';
import * as Jimp from 'jimp';
import * as FS from 'fs';

export class Rip extends Command {
    constructor(){
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

    async execute(input: Input){
        let fallen = input.getArgument('user') as GuildMember;

        let tombstoneImageUrl : string = 'https://us.123rf.com/450wm/kellyvandellen/kellyvandellen1712/kellyvandellen171200166/92196178-empty-marble-gravestone-in-historic-cemetery-in-southern-usa.jpg?ver=6';
        let imageDirectory : string = './tombstone.png';

        //Unused for now
        let textColor : string = '0x666666ff';
        let textFont : string = Jimp.FONT_SANS_32_BLACK;

        let outputText : string = ':skull: F';

        let image : Jimp = await Jimp.read(tombstoneImageUrl) as Jimp;
        let font = await Jimp.loadFont(textFont);
        this.AddTextToImage(image, font, fallen);

        this.WriteSendAndDeleteImage(image, imageDirectory, input, outputText);
    }

    private AddTextToImage(image: Jimp, font: any, fallen: GuildMember) {
        image.print(font, 0, 0, {
            text: fallen.displayName,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, image.getWidth(), image.getHeight());
    }

    private ApplyTintToMessage(image: Jimp, tintColor: string, tintIntensity: number) {
        image = image.color([
            { apply: 'mix', params: [tintColor, tintIntensity] }
        ]);
        return image;
    }

    private WriteSendAndDeleteImage(image: Jimp, imageDirectory: string, input: Input, outputText: string) {
        //Write to file.
        image.writeAsync(imageDirectory).then(msg => {
            //Then send the image in the chat with text
            input.channel.send(outputText, {
                files: [
                    imageDirectory
                ]
            }).then(msg => {
                //Then delete the file that was just written.
                FS.unlinkSync(imageDirectory);
            });
        });
    }
}
