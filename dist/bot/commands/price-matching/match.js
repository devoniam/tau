"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const request = require("request");
const cheerio = require("cheerio");
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
                    required: true,
                }
            ]
        });
    }
    execute(input) {
        let url = input.getArgument('url');
        request(url, { gzip: true }, function (a, b, body) {
            let $ = cheerio.load(body);
            let item_text = $('#productTitle').text().trim();
            let amazon_search = 'https://www.amazon.com/s?k=' + encodeURI(item_text);
            let amazon = 'https://www.amazon.com';
            request(amazon_search, { gzip: true }, (a2, b2, body2) => {
                let $$ = cheerio.load(body2);
                let link = $$('.s-result-list .a-link-normal').first().attr('href');
                input.channel.send(amazon + link);
                console.log(amazon_search);
            });
        });
    }
}
exports.Match = Match;
//# sourceMappingURL=match.js.map