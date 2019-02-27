import { Command, Input } from '@api';
import * as request from 'request';
import { Response } from 'request';
const unescape = require('unescape');

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
                // {
                //     name: 'amount',
                //     description: 'The amount of questions to ask',
                //     required: false,
                //     default: 1
                // },
                {
                    name: 'category',
                    description: 'The subject the questions will ask about.',
                    required: false,
                    options: triviaCategories,
                    default: ''
                },
                {
                    name: 'difficulty',
                    description: 'How challenging the question is to answer.',
                    required: false,
                    options: ['any', 'easy', 'medium', 'hard'],
                    default: ''
                },
                {
                    name: 'type',
                    description: 'The way the answers are presented for the question',
                    required: false,
                    options: ['mulitple', 'tf'],
                    default: ''
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
        let questionAmount = '?amount=1';
        let openTDB = 'https://opentdb.com/api.php';

        if (!difficulty || difficulty == 'any' || difficulty == 'all') { difficultyURL = ''; }
        if (!type || type == 'any' || type == 'all') { typeURL = ''; }
        if (type == 'tf') { typeURL = '&type=boolean'; }

        for (let i of triviaCategories) {
            if (category == i && category != triviaCategories[0]) {
                categoryURL = '&category=' + (8 + triviaCategories.indexOf(i)).toString();
            }
        }

        let databaseURL = request(openTDB + questionAmount + categoryURL + difficultyURL + typeURL, (error: any, response: Response, body: any) => {
            if (error) {
                input.channel.send({
                    embed: {
                        color: 3447003,
                        title: 'Connection Error',
                        description: "Unable to retrieve Online Trivia Datbase"
                    }
                });
            }

            let parsed = JSON.parse(body) as TriviaResponse;
            let rnd = Math.floor(Math.random() * parsed.results.length);
            let question = unescape(parsed.results[rnd].question);
            let incorrect_answers: string[] = [];
            _.each(parsed.results[rnd].incorrect_answers, s => incorrect_answers.push(s));
            let correct_answer = unescape(parsed.results[rnd].correct_answer);
            let answers = [correct_answer];
            incorrect_answers.forEach(element => { answers.push(element); });

            for (let i = answers.length - 1; i > 0; i--) {
                let e = Math.floor(Math.random() * (i + 1));
                let temp = answers[i];
                answers[i] = answers[e];
                answers[e] = temp;
            }

            console.log("Answers:" + answers);
            console.log('Type: ' + typeURL);
            console.log('URL: ' + openTDB + questionAmount + categoryURL + difficultyURL + typeURL);
            console.log('results: ' + parsed.results);
            console.log('questions: ' + question);
            console.log('Category: ' + parsed.results[rnd].category);

            if (typeURL == '&type=mutiple') {
                input.channel.send({
                    embed:
                    {
                        color: 3447003,
                        title: '__' + parsed.results[rnd].category + '__',
                        description: question,
                        fields: [
                            {
                                name: 'A)',
                                value: answers[0]
                            },
                            {
                                name: 'B)',
                                value: answers[1]
                            },
                            {
                                name: 'C)',
                                value: answers[2]
                            },
                            {
                                name: 'D)',
                                value: answers[3]
                            }
                        ],
                    }
                });
            }
            else {
                input.channel.send({
                    embed:
                    {
                        color: 3447003,
                        title: '__' + parsed.results[rnd].category + '__',
                        description: question,
                        fields: [
                            {
                                name: 'A)',
                                value: answers[0]
                            },
                            {
                                name: 'B)',
                                value: answers[1]
                            }
                        ],
                    }
                });
            }
        });
    }
}

type TriviaResponse = {
    response_code: number;
    results: {
        category: string;
        type: string;
        difficulty: string;
        question: string;
        correct_answer: string;
        incorrect_answers: string[];
    }[];
}
