import { Command, Input } from '@api';
import * as request from 'request';
import * as cheerio from 'cheerio';
import { RichEmbed } from 'discord.js';

export class Match extends Command {
    constructor() {
        super({
            name: 'match',
            description: 'Searches the internet for the given link and finds matches on various marketplaces.',
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

    execute(input: Input) {
        let url = input.getArgument('url') as string;

        /* Return Amazon */
        request(url, { gzip: true }, function(a, b, body){
          
            // load html of web page
            let $ = cheerio.load(body);
            // Title of product being matched
            let item_text = $('#productTitle').text().trim(); 
            // Price of product being matched
            let item_price = Math.floor(parseFloat($('#priceblock_ourprice').text().trim().replace('$', '')));
            // Combines the encoded item_text and throws it into the site's search URL
            let item = encodeURI(item_text);

            let amazon_search = 'https://www.amazon.com/s?k=' + item;
            let amazon = 'https://www.amazon.com';

            let ebay_search = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313.TR12.TRC2.A0.H0.X' + item + '.TRS0&_nkw=' + item;
            let ebay = 'https://www.ebay.com';

            let newegg_search = 'https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=' + item;
            let newegg = 'https://www.newegg.com';

            request(amazon_search, { gzip: true }, (a2, b2, body2) => {
                let $$ = cheerio.load(body2);

                // Get all rows
                let rows = $$('.a-section');
                let matches : Listing[] = [];

                // Iterate through each row
                rows.each((i, row) => {
                    // Get the first <h5> in the row
                    let h5 = $$(row).find('h5').first();

                    // Get the first class="a-price-whole" in the row (has price)
                    let whole = $$(row).find('.a-price-whole').first();

                    // If h5 or price is missing, skip
                    if (h5.length == 0) return;
                    if (whole.length == 0) return;

                    // Extract text from each
                    let title = h5.text().trim();
                    let price_whole = parseInt(whole.text().trim().replace('.', ''));
                    let link = ''; // get link to row item here
                    
                    // Place matches into an array
                    if (price_whole < item_price) {
                        matches.push({
                            name: title,
                            site: 'amazon',
                            price: price_whole,
                            url: link
                        });
                    }

                    console.log(title, '$' + price_whole);
                });

                let nextLowest : Listing | undefined;
                for (let i = 0; i < matches.length; i++) {
                    let match = matches[i];

                    if (match.price < item_price) {
                        nextLowest = match;
                        break;
                    }
                }

                if (nextLowest) {
                    console.log('Found a next lowest');
                    console.log(nextLowest);

                    input.channel.send(new RichEmbed({
                        author: {
                            name: 'Amazon'
                        },
                        fields: [
                            {
                                name: nextLowest.name,
                                value: `$${nextLowest.price}`
                            }
                        ]
                    }));
                }
            });
        });

        /* Return Ebay 
        request(url, { gzip: true }, function(a, b, body){
          
            // load html of web page
            let $ = cheerio.load(body);
            // Title of product being matched
            let item_text = $('#itemTitle').text().trim(); 
            // Price of product being matched
            let item_price = Math.floor(parseFloat($('#prcIsum .content').text().trim().replace('$', '')));
            // Combines the encoded item_text and throws it into the site's search URL
            let item = encodeURI(item_text);

            let ebay_search = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313.TR12.TRC2.A0.H0.X' + item + '.TRS0&_nkw=' + item;
            let ebay = 'https://www.ebay.com';

            request(ebay_search, { gzip: true }, (a2, b2, body2) => {
                let $$ = cheerio.load(body2);

                // Get all rows
                let rows = $$('s-item__wrapper');
                let matches : Listing[] = [];

                // Iterate through each row
                rows.each((i, row) => {
                    // Get the first <h5> in the row
                    let h3 = $$(row).find('h3').first();

                    // Get the first class="a-price-whole" in the row (has price)
                    let whole = $$(row).find('.s-item__price').first();

                    // If h5 or price is missing, skip
                    if (h3.length == 0) return;
                    if (whole.length == 0) return;

                    // Extract text from each
                    let title = h3.text().trim();
                    let price_whole = parseInt(whole.text().trim().replace('.', ''));
                    let link = ''; // get link to row item here
                    
                    // Place matches into an array
                    if (price_whole < item_price) {
                        matches.push({
                            name: title,
                            site: 'ebay',
                            price: price_whole,
                            url: link
                        });
                    }

                    console.log(title, '$' + price_whole);
                });

                let nextLowest : Listing | undefined;
                for (let i = 0; i < matches.length; i++) {
                    let match = matches[i];

                    if (match.price < item_price) {
                        nextLowest = match;
                        break;
                    }
                }

                if (nextLowest) {
                    console.log('Found a next lowest');
                    console.log(nextLowest);

                    input.channel.send(new RichEmbed({
                        author: {
                            name: 'Ebay'
                        },
                        fields: [
                            {
                                name: nextLowest.name,
                                value: `$${nextLowest.price}`
                            }
                        ]
                    }));
                }
            });
        }); */
    }
}

let matches : Listing[] = [];
// parse html here
// for each listing in the html, run:
{
matches.push({
    name: 'djhsdg',
    site: 'ebay',
    price: 15,
    url: 'https://ebay.com/asfjhafj'
});
}

let sorted = matches.sort((a, b) => { return b.price - a.price; });

type Listing = {
    price: number;
    name: string;
    site: 'amazon' | 'ebay' | 'newegg';
    url: string;
};