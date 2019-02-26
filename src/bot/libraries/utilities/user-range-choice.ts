import {Message} from "discord.js";
import {numberedList} from "@libraries/utilities/numbered-list";
import {Input} from "@api";

export async function userRangedChoice(input: Input, arr: any[], param: any): Promise<any> {

    await input.channel.send(numberedList(arr, param) + `\n**Choose a number Between 1-${arr.length}**`);

    return new Promise((resolve, reject) => {
        const filter = ((n: any) => !isNaN(n) && parseInt(n.content) <= arr.length && parseInt(n.content) > 0 && n.author.id === input.member.id);

        const collector = input.channel.createMessageCollector(filter);

        collector.once('collect', async (n: Message) => {
            let selectedOption = arr[parseInt(n.content) - 1];
            console.log(`Got input ${n.content} corresponding to ${selectedOption}`);
            resolve(selectedOption);
        });
    });
}