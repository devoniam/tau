"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const request = require("request");
const unescape = require('unescape');
let triviaCategories = [
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
];
class Trivia extends _api_1.Command {
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
    execute(input) {
        let category = input.getArgument('category');
        let difficulty = input.getArgument('difficulty');
        let type = input.getArgument('type');
        let difficultyURL = '&difficulty=' + difficulty;
        let typeURL = '&type=' + type;
        let categoryURL = '';
        let questionAmount = '?amount=10';
        let openTDB = 'https://opentdb.com/api.php';
        if (!difficulty || difficulty == 'any' || difficulty == 'all') {
            difficultyURL = '';
        }
        if (!type || type == 'any' || type == 'all') {
            typeURL = '';
        }
        if (type == 'tf') {
            typeURL = '&type=boolean';
        }
        for (let i of triviaCategories) {
            if (category == i && category != triviaCategories[0]) {
                categoryURL = '&category=' + (8 + triviaCategories.indexOf(i)).toString();
            }
        }
        let databaseURL = request(openTDB + questionAmount + categoryURL + difficultyURL + typeURL, (error, response, body) => {
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
            let count = 0;
            let question = unescape(parsed.results[count].question);
            let incorrect_answers = [];
            _.each(parsed.results[count].incorrect_answers, s => incorrect_answers.push(s));
            let correct_answer = unescape(parsed.results[count].correct_answer);
            let answers = [correct_answer];
            incorrect_answers.forEach(element => { answers.push(element); });
            do {
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
                console.log('Category: ' + parsed.results[count].category);
                if (typeURL == '&type=mutiple') {
                    input.channel.send({
                        embed: {
                            color: 3447003,
                            title: '__' + parsed.results[count].category + '__',
                            description: question,
                            fields: [{
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
                                }],
                        }
                    });
                }
                else {
                    input.channel.send({
                        embed: {
                            color: 3447003,
                            title: '__' + parsed.results[count].category + '__',
                            description: question,
                            fields: [{
                                    name: 'A)',
                                    value: answers[0]
                                },
                                {
                                    name: 'B)',
                                    value: answers[1]
                                }],
                        }
                    });
                }
                count++;
            } while (count < 10);
        });
    }
}
exports.Trivia = Trivia;
//# sourceMappingURL=trivia.js.map