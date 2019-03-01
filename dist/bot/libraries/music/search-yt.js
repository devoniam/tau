"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const cheerio = require("cheerio");
function searchyt(searchTerm) {
    return new Promise((resolve, reject) => {
        let ytresults = [];
        request('https://www.youtube.com/results?search_query=' + searchTerm, (error, response, body) => {
            if (error)
                reject(error);
            let $ = cheerio.load(body);
            let results = $('h3.yt-lockup-title a');
            results.each((index, element) => {
                let row = $(element);
                if (!(/\/watch\?v=([\w-]+)/.test(row.attr('href'))))
                    return;
                let title = row.text();
                let url = row.attr('href');
                ytresults.push({ title, url });
            });
            resolve(ytresults);
        });
    });
}
exports.searchyt = searchyt;
//# sourceMappingURL=search-yt.js.map