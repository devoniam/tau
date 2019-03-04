import { Command, Input } from '@api';
import * as request from 'request';
import { Response } from 'request';
import { Message } from 'discord.js';
const entities = require("html-entities").AllHtmlEntities;

//TODO: Trivia should be multiplayer, but work fine for single player
//TODO: End game if inactive for certain amount of time
//along with the trivia question thats displayed. The players click the reaction they think is the answer
//TODO: Make the trivia questions run on a loop that waits for player(s) to answer.
//TODO: Once player(s) have submitted, the bot displays the correct answer and gives points to the plyer(s) that got it right
//TODO: Add Stop command for admins
//TODO: Better Error handling

//------------------[Maybe]-------------------- 
//TODO: Add Trivia join command. 
//TODO: Add Amount command

//--------[Requires Framework Support]---------
//DONE: Display amount of questions for each category
//TODO: Integrate reaction collector

//--------------------[Done]---------------------
//DONE: Add reacts a,b,c,d to the displayed trivia

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

function parseResponse<T = any>(URL: string): Promise<T> {
    return new Promise((resolve, reject) => {
        request(URL, (error: any, response: Response, body: any) => {
            if (error) { reject(error); }
            //console.log(body);
            resolve(JSON.parse(body));
        });
    });
}

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

    //Get the amount of questions in each category and difficulty
    // async init() {
    //     for (let i = 1; i < triviaCategories.length; i++) {
    //         let URL = 'https://opentdb.com/api_count.php?category=' + (i + 8).toString();
    //         let c = await parseResponse<QuestionCount>(URL);
    //         let easy = c.category_question_count.total_easy_question_count;
    //         let medium = c.category_question_count.total_medium_question_count;
    //         let hard = c.category_question_count.total_hard_question_count;
    //         //console.log(i + 8);
    //         //console.log(`id: ${c.category_id}`);
    //         //console.log("link: " + c);
    //         //console.log("questioncount: " + c.category_question_count.total_easy_question_count);
    //         triviaCategories[i] + ' - Easy:' + easy + ' - Medium:' + medium + ' - Hard:' + hard;

    //         //let c = await parseResponse('https://opentdb.com/api_count.php?category=' + (i + 8).toString() );
    //     }
    // }

    async execute(input: Input) {

        let category = input.getArgument('category');
        let difficulty = input.getArgument('difficulty');
        let type = input.getArgument('type');

        //Translate user input into URLS for the database
        let difficultyURL: string = '&difficulty=' + difficulty;
        let typeURL: string = '&type=' + type;
        let categoryURL: string = '';
        let questionAmount = '?amount=10';
        let openTDB = 'https://opentdb.com/api.php';

        //Set the URLs to default any if no arguments are entered
        if (!difficulty || difficulty == 'any' || difficulty == 'all') { difficultyURL = ''; }
        if (!type || type == 'any' || type == 'all') { typeURL = ''; }

        //Set URL for chosen question type
        if (type == 'tf') { typeURL = '&type=boolean'; }

        for (let i of triviaCategories) {
            if (category == i && category != triviaCategories[0]) {
                categoryURL = '&category=' + (8 + triviaCategories.indexOf(i)).toString();
            }
        }

        //Retrieve trivia questions from database and fix any syntax issues that may have occured
        let parsed = await parseResponse(openTDB + questionAmount + categoryURL + difficultyURL + typeURL) as TriviaResponse;
        let count = 0;
        //do {
            
            //Fix any encoding errors using entities.decode()
            //Normalize the names for the parsed TriviaResponse data 
            let question = entities.decode(parsed.results[count].question);
            let incorrect_answers: string[] = [];
            let correct_answer = entities.decode(parsed.results[count].correct_answer);
            let answers = [correct_answer];
            _.each(parsed.results[count].incorrect_answers, s => incorrect_answers.push(entities.decode(s)));
            incorrect_answers.forEach(element => { answers.push(element); });

            // console.log(`Question: ${question}`);
            // console.log(`dQuestion: ${entities.decode(question)}`);
            // console.log(`CorrectAnswer: ${correct_answer}`);
            // console.log(`IncorrectAnswers: ${incorrect_answers}`);
            // console.log(`Category: ${parsed.results[count].category}`);

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

            //getLogger only appears in the website console
            //Use console.log for debugging
            this.getLogger().debug("Answers:" + answers);
            this.getLogger().debug('Type: ' + parsed.results[count].type);
            this.getLogger().debug('URL: ' + openTDB + questionAmount + categoryURL + difficultyURL + typeURL);
            this.getLogger().debug('results: ' + parsed.results);
            this.getLogger().debug('questions: ' + question);
            this.getLogger().debug('Category: ' + parsed.results[count].category);

            //Display the correct message depending on the answer type
            if (parsed.results[count].type == 'multiple') {
               let messageMultiple = await input.channel.send({
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
                }) as Message;
                await messageMultiple.react('🇦');
                await messageMultiple.react('🇧');
                await messageMultiple.react('🇨');
                await messageMultiple.react('🇩');
            }
            else {
                let messageBoolean = await input.channel.send({
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
                }) as Message;
                await messageBoolean.react('🇦');
                await messageBoolean.react('🇧');
            }

            count++;
            //   const collector = (reaction, user)
        //}
        //while (count < 10)
    }
}

type QuestionCount = {
    category_id: number;
    category_question_count: {
        total_question_count: string;
        total_easy_question_count: string;
        total_medium_question_count: string;
        total_hard_question_count: string;
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
