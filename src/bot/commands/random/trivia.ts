import { Command, Input } from '@api';
import * as request from 'request';

let triviaCategories: string[] = [
    'All',
    'General',
    'Books',
    'Film',
    'Music',
    'Theatre',
    'Television',
    'VideoGames',
    'BoardGames',
    'Nature',
    'Computers',
    'Mathematics',
    'Mythology',
    'Sports',
    'Geography',
    'History',
    'Politics',
    'Art',
    'Celebrities',
    'Animals',
    'Vehicles',
    'Comics',
    'Gadgets',
    'Anime',
    'Cartoons'
]

export class Trivia extends Command {
    constructor() {
        super({
            name: 'trivia',
            aliases: ['pick', 'choose'],
            description: 'Begins the Trivia Game.',
            arguments: [
                {
                    name: 'category',
                    description: 'The subject the questions will ask about.',
                    required: false,
                    options: triviaCategories
                },
                {
                    name: 'difficulty',
                    description: 'How challenging the question is to answer.',
                    required: false,
                    options: ['all', 'easy', 'medium', 'hard']
                },
                {
                    name: 'type',
                    description: 'The way the answers are presented for the question',
                    required: false,
                    options: ['mulitple', 'tf']
                },
            ]
        });
    }

    execute(input: Input) {

        let category = input.getArgument('category');
        let difficulty = input.getArgument('difficulty');
        let type = input.getArgument('type');

        let difficultyURL: string = '&difficulty=' + difficulty;
        let typeURL: string = '&type=' + type;
        let categoryURL: string = '';

        let questionAmount = '?amount=100';
        let openTDB = 'https://opentdb.com/api.php';

        if (!difficulty)
            difficulty = ' ';
        if (!type)
            type = ' ';

        for (let i of triviaCategories) {
            if (category == i && category != triviaCategories[0]) {
                categoryURL = '&category=' + (8 + triviaCategories.indexOf(i)).toString();
            }
        }

        let databaseURL = request(openTDB + questionAmount + categoryURL + difficulty + type, (error, response, body) => {
            if (error) {
                input.channel.send({
                    embed: {
                        color: 3447003,
                        title: 'Connection Error',
                        description: "Unable to retrieve Online Trivia Datbase"
                    }
                });
            }

            let parsed = JSON.parse(body);
            input.channel.send({
                embed:
                {
                    color: 3447003,
                    title: '__' + category + '__',
                    description: "this is a description"
                }
            });

            console.log('results: ' + parsed.results);
            console.log('Category: ' + category);
        });
    }
}
