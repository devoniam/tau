"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const request = require("request");
const unescape = require('unescape');
const triviaCategories = [
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
function parseResponse(URL) {
    return new Promise((resolve, reject) => {
        request(URL, (error, response, body) => {
            if (error) {
                reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
}
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
    async init() {
        console.log('rjhrjh');
        for (let i = 1; i < triviaCategories.length; i++) {
            console.log(i);
            let URL = 'https://opentdb.com/api_count.php?category=' + (i + 8).toString();
            let c = await parseResponse(URL);
            console.log("link: " + c);
            console.log("questioncount: " + c.category_question_count.easy);
            triviaCategories[i] + ' - Easy:' + c.category_question_count.easy;
        }
    }
    async execute(input) {
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
        let parsed = await parseResponse(openTDB + questionAmount + categoryURL + difficultyURL + typeURL);
        let count = 0;
        do {
            let rnd = Math.floor(Math.random() * parsed.results.length);
            let question = unescape(parsed.results[count].question);
            let incorrect_answers = [];
            _.each(parsed.results[count].incorrect_answers, s => incorrect_answers.push(s));
            let correct_answer = unescape(parsed.results[count].correct_answer);
            let answers = [correct_answer];
            incorrect_answers.forEach(element => { answers.push(element); });
            if (answers.length > 2) {
                for (let i = answers.length - 1; i > 0; i--) {
                    let e = Math.floor(Math.random() * (i + 1));
                    let temp = answers[i];
                    answers[i] = answers[e];
                    answers[e] = temp;
                }
            }
            else {
                if (correct_answer == 'True') {
                    answers[0] = correct_answer;
                    answers[1] = incorrect_answers[0];
                }
                else if (incorrect_answers[0] == 'True') {
                    answers[0] = incorrect_answers[0];
                    answers[1] = correct_answer;
                }
            }
            this.getLogger().debug("Answers:" + answers);
            this.getLogger().debug('Type: ' + parsed.results[0].type);
            this.getLogger().debug('URL: ' + openTDB + questionAmount + categoryURL + difficultyURL + typeURL);
            this.getLogger().debug('results: ' + parsed.results);
            this.getLogger().debug('questions: ' + question);
            this.getLogger().debug('Category: ' + parsed.results[count].category);
            if (parsed.results[count].type == 'multiple') {
                await input.channel.send({
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
                await input.channel.send({
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
    }
}
exports.Trivia = Trivia;
//# sourceMappingURL=trivia.js.map