"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const request = require("request");
const entities = require("html-entities").AllHtmlEntities;
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
        let question = entities.decode(parsed.results[count].question);
        let incorrect_answers = [];
        let correct_answer = entities.decode(parsed.results[count].correct_answer);
        let answers = [correct_answer];
        _.each(parsed.results[count].incorrect_answers, s => incorrect_answers.push(entities.decode(s)));
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
        this.getLogger().debug('Type: ' + parsed.results[count].type);
        this.getLogger().debug('URL: ' + openTDB + questionAmount + categoryURL + difficultyURL + typeURL);
        this.getLogger().debug('results: ' + parsed.results);
        this.getLogger().debug('questions: ' + question);
        this.getLogger().debug('Category: ' + parsed.results[count].category);
        if (parsed.results[count].type == 'multiple') {
            let messageMultiple = await input.channel.send({
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
            await messageMultiple.react('🇦');
            await messageMultiple.react('🇧');
            await messageMultiple.react('🇨');
            await messageMultiple.react('🇩');
        }
        else {
            let messageBoolean = await input.channel.send({
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
            await messageBoolean.react('🇦');
            await messageBoolean.react('🇧');
        }
        count++;
    }
}
exports.Trivia = Trivia;
//# sourceMappingURL=trivia.js.map