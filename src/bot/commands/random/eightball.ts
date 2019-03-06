import { Command, Input } from '@api';

const responses = [
    "You're beginning to annoy me.",
    "Never.",
    "Not soon.",
    "Bet on it.",
    "Odds aren't good.",
    "Maybe...",
    "It depends.",
    "Very likely.",
    "Gone fishing, ask again later.",
    "Ask me if I care.",
    "Absolutely.",
    "Luck is in your favor.",
    "I'd count on it.",
    "Come on, let's be real.",
    "Not likely.",
    "That's funny...",
    "Yeah, sure buddy.",
    "One way or another.",
    "Very soon.",
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes, definitely.",
    "I mean, probably.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook is good.",
    "Yes.",
    "Signs point to yes.",
    "Spirits hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict that now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook is not so good.",
    "Very doubtful.",
    "Who cares?",
    "...",
    "Let me go ask your mother.",
    "Not sure, I'm just a ball."
];

export class EightBall extends Command {
    constructor() {
        super({
            name: 'eightball',
            aliases: ['8ball', '8', 'eight', 'ask'],
            description: 'Ask the eight ball a question.',
            arguments: [
                {
                    name: 'question',
                    description: 'The question to ask.',
                    expand: true,
                    required: true
                }
            ]
        });
    }

    async execute(input: Input) {
        // Randomise responses using an array
        let response = responses[_.random(0, responses.length - 1)];

        // Send the response
        await input.channel.send(":8ball:  " + response);
    }
}
