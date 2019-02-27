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

//TODO: Decide whether Trivia should be multiplayer or single player
//TODO: Make the trivia questions run on a loop that waits for player(s) to answer.
//TODO: Once player(s) have submitted, the bot displays the correct answer and gives points to the plyer(s) that got it right
//TODO: Add Stop command
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

    execute(input: Input) {

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
        //URL to pull trivia questions from
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


            //Retrieve trivia questions from database and fix any syntax issues that may have occured

            let parsed = JSON.parse(body) as TriviaResponse;
            let count = 0;

            let question = unescape(parsed.results[count].question);
            let incorrect_answers: string[] = [];
            _.each(parsed.results[count].incorrect_answers, s => incorrect_answers.push(s));
            let correct_answer = unescape(parsed.results[count].correct_answer);
            let answers = [correct_answer];
            incorrect_answers.forEach(element => { answers.push(element); });

           // do {

                //Randomize answers before displaying
                for (let i = answers.length - 1; i > 0; i--) {
                    let e = Math.floor(Math.random() * (i + 1));
                    let temp = answers[i];
                    answers[i] = answers[e];
                    answers[e] = temp;
                }

                // console.log("Answers:" + answers);
                // console.log('Type: ' + typeURL);
                // console.log('URL: ' + openTDB + questionAmount + categoryURL + difficultyURL + typeURL);
                // console.log('results: ' + parsed.results);
                // console.log('questions: ' + question);
                // console.log('Category: ' + parsed.results[count].category);


                if (typeURL == '&type=mutiple') {
                    input.channel.send({
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
                    input.channel.send({
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
           // }
           // while (count < 10)
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
