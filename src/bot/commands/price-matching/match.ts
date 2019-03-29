import { Command, Input } from '@api';
import * as request from 'request';
import * as cheerio from 'cheerio';

export class Match extends Command {
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
            
            // Combines the encoded item_text and throws it into amazon's search URL
            let amazon_search = 'https://www.amazon.com/s?k=' + encodeURI(item_text);
            let amazon = 'https://www.amazon.com';

            /* Return Amazon */
            request(amazon_search, { gzip: true }, (a2, b2, body2) => {
                let $$ = cheerio.load(body2);
                let link = $$('.s-result-list .a-link-normal').first().attr('href');

                input.channel.send(amazon + link);

                // console.log(amazon_search); 
                
                // Get all rows
                let rows = $$('.a-section');
                let prices : number[] = [];

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
                    
                    // Place prices into an array
                    if (price_whole < item_price) {
                        prices.push(price_whole);
                    }

                    console.log(title, '$' + price_whole);
                });

                // Find next lowest
                prices = prices.sort((a, b) => {
                    return b - a;
                });

                console.log('sorted:', prices)

                let lowestPrice = prices[prices.length-1];
                console.log('lowest:', lowestPrice)
            });

        });
    }
}