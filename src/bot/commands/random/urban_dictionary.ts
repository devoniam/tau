import { Command, Input } from '@api';
import * as request from 'request';
import * as cheerio from 'cheerio';

export class Define extends Command {
    constructor() {
        super({
            name: 'define',
            description: 'Search the Urban Dictionary for a word or phrase.',
            arguments: [
                {
                    name: 'words',
                    description: 'A word or phrase.',
                    required: true,
                    expand: true
                    
                }
            ]
        });
    }

    execute(input: Input) {
        /*expects user to input text*/
        let words = input.getArgument('words') as string;
        let words_search = encodeURI(words);
        let urban_search = 'https://www.urbandictionary.com/define.php?term=' + words_search;
    
        request(urban_search, {gzip: true}, function(a, b, body){
            let $ = cheerio.load(body);

            // $('.s-result-list .a-link-normal').each(function(i, x) {
            //     console.log($(x).text());
            // })

            let def = $('.small-12 large-8 columns .content .def-panel .meaning').first().text().trim();
            console.log(def);

            input.channel.send(urban_search);
            console.log(urban_search);
        });
    }
}
