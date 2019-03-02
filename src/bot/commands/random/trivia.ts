import { Command, Input } from '@api';
import * as request from 'request';
import { Response } from 'request';
const unescape = require('unescape');


const triviaCategories: string[] = [
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

//Resolve is like return but for a Promise
//Reject returns any errors that may occur
function parseResponse<T = any>(URL: string): Promise<T> {
    return new Promise((resolve, reject) => {
        request(URL, (error: any, response: Response, body: any) => {
            if (error) { reject(error); }
            resolve(JSON.parse(body));
        });
    });
}


//TODO: Trivia should be multiplayer, but work fine for single player
//TODO: End game if inactive for certain amount of time
//TODO: Add amount of questions in each category
//TODO: Generate :regional_indicator_a: :regional_indicator_b: :regional_indicator_b: and :regional_indicator_d:
//along with the trivia question thats displayed. The players click the reaction they think is the answer
//TODO: Make the trivia questions run on a loop that waits for player(s) to answer.
//TODO: Once player(s) have submitted, the bot displays the correct answer and gives points to the plyer(s) that got it right
//TODO: Add Stop command for admins
//TODO: Create a reaction collector

//------------------[Maybe]-------------------- 
//TODO: Add Trivia join command. 
//TODO: Add Amount command

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

    async init() {
        console.log('rjhrjh');
        
        //let amountOfQuestions = request(); 
        //_.each(parsed.results[count].incorrect_answers, s => incorrect_answers.push(s));
        for (let i = 1; i < triviaCategories.length; i++) {
            console.log(i);
            let URL = 'https://opentdb.com/api_count.php?category=' + (i + 8).toString();
            let c = await parseResponse<QuestionCount>(URL);
        
            console.log("link: " + c);
            console.log("questioncount: " + c.category_question_count.easy);
            triviaCategories[i] + ' - Easy:' + c.category_question_count.easy;

            //let c = await parseResponse('https://opentdb.com/api_count.php?category=' + (i + 8).toString() );
        }
    }

    async execute(input: Input) {

        let category = input.getArgument('category');
        let difficulty = input.getArgument('difficulty');
        let type = input.getArgument('type');

        //Translate user input into URLS for the datase
        let difficultyURL: string = '&difficulty=' + difficulty;
        let typeURL: string = '&type=' + type;
        let categoryURL: string = '';
        let questionAmount = '?amount=10';
        let openTDB = 'https://opentdb.com/api.php';

        if (!difficulty || difficulty == 'any' || difficulty == 'all') { difficultyURL = ''; }
        if (!type || type == 'any' || type == 'all') { typeURL = ''; }
        if (type == 'tf') { typeURL = '&type=boolean'; }

        for (let i of triviaCategories) {
            if (category == i && category != triviaCategories[0]) {
                categoryURL = '&category=' + (8 + triviaCategories.indexOf(i)).toString();
            }
        }


        // //URL to pull trivia questions from
        // let databaseURL = request(openTDB + questionAmount + categoryURL + difficultyURL + typeURL, async (error: any, response: Response, body: any) => {
        //     if (error) {
        //         input.channel.send({
        //             embed: {
        //                 color: 3447003,
        //                 title: 'Connection Error',
        //                 description: "Unable to retrieve Online Trivia Datbase"
        //             }
        //         });
        //     }

        //Retrieve trivia questions from database and fix any syntax issues that may have occured
        let parsed = await parseResponse(openTDB + questionAmount + categoryURL + difficultyURL + typeURL) as TriviaResponse;
        let count = 0;
        do {
            let rnd = Math.floor(Math.random() * parsed.results.length);
            let question = unescape(parsed.results[count].question);
            let incorrect_answers: string[] = [];
            _.each(parsed.results[count].incorrect_answers, s => incorrect_answers.push(s));
            let correct_answer = unescape(parsed.results[count].correct_answer);
            let answers = [correct_answer];
            incorrect_answers.forEach(element => { answers.push(element); });

            //Randomize answers before displaying
            if (answers.length > 2) {
                for (let i = answers.length - 1; i > 0; i--) {
                    let e = Math.floor(Math.random() * (i + 1));
                    let temp = answers[i];
                    answers[i] = answers[e];
                    answers[e] = temp;
                }
            }
            //Make A) say true every time
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

            // getLogger Only appears in the website console
            //Use console.log for debugging
            this.getLogger().debug("Answers:" + answers);
            this.getLogger().debug('Type: ' + parsed.results[0].type);
            this.getLogger().debug('URL: ' + openTDB + questionAmount + categoryURL + difficultyURL + typeURL);
            this.getLogger().debug('results: ' + parsed.results);
            this.getLogger().debug('questions: ' + question);
            this.getLogger().debug('Category: ' + parsed.results[count].category);

            if (parsed.results[count].type == 'multiple') {
                await input.channel.send({
                    embed:
                    {
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
                    embed:
                    {
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
            //   const collector = (reaction, user)
        }
        while (count < 10)
    }
}

type QuestionCount = {
    category_id: number;
    category_question_count: {
        easy: string;
        medium: string;
        hard: string;
        total: string;
    };
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
