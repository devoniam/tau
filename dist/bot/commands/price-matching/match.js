"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Match extends _api_1.Command {
    constructor() {
        super({
            name: 'match',
            description: 'Searches the internet for the given link and finds prices on various marketplaces.',
            arguments: [
                {
                    name: 'url',
                    description: 'A link to the item of interest.',
                    constraint: 'url',
                    required: true
                }
            ]
        });
    }
    execute(input) {
        let url = input.getArgument('url');
        input.channel.send('Not yet implemented.');
    }
}
exports.Match = Match;
//# sourceMappingURL=match.js.map