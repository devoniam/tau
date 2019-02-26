"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numbered_list_1 = require("@libraries/utilities/numbered-list");
async function userRangedChoice(input, arr, param) {
    await input.channel.send(numbered_list_1.numberedList(arr, param) + `\n**Choose a number Between 1-${arr.length}**`);
    return new Promise((resolve, reject) => {
        const filter = ((n) => !isNaN(n) && parseInt(n.content) <= arr.length && parseInt(n.content) > 0 && n.author.id === input.member.id);
        const collector = input.channel.createMessageCollector(filter);
        collector.once('collect', async (n) => {
            let selectedOption = arr[parseInt(n.content) - 1];
            console.log(`Got input ${n.content} corresponding to ${selectedOption}`);
            resolve(selectedOption);
        });
    });
}
exports.userRangedChoice = userRangedChoice;
//# sourceMappingURL=user-range-choice.js.map