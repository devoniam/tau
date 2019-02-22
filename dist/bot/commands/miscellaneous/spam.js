"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Spam extends _api_1.Command {
    constructor() {
        super({
            name: 'spam',
            description: 'The only thing I can say to describe this is: 😱',
            arguments: [
                {
                    name: 'user',
                    description: 'The poor soul who shall be flooded with messages.',
                    constraint: 'mention',
                    required: true
                },
                {
                    name: 'amount',
                    description: 'The number of messages to send (1 – 100).',
                    constraint: 'number',
                    required: true,
                    eval: (input) => input > 0 && input <= 100
                },
                {
                    name: 'delay',
                    description: 'The delay between messages in seconds (minimum 5).',
                    constraint: 'number',
                    required: true,
                    eval: (input) => input >= 5
                },
                {
                    name: 'messages',
                    description: 'The message(s) to spam.',
                    expand: true
                }
            ]
        });
    }
    execute(input) {
        let user = input.getArgument('user');
        let amount = input.getArgument('amount');
        let delay = input.getArgument('delay');
        let messages = input.getArgument('messages');
        if (user === null) {
            input.channel.send("I need a user to spam, use @ to select a user");
            return;
        }
        if (isNaN(amount)) {
            amount = 3;
            input.channel.send("Input not a number, converted to 3");
        }
        if (isNaN(delay)) {
            delay = 0.4;
            input.channel.send("Input not a number, converted to 0.4");
        }
        let delayMinutes = Math.floor((delay * amount) / 60);
        let delaySeconds = (delay * amount) - (delayMinutes * 60);
        let warningMsg = `The time of reckoning has come. You will receive ${amount} messages over `;
        if (delayMinutes > 0) {
            warningMsg += `${delayMinutes} minutes `;
        }
        if (delaySeconds > 0) {
            warningMsg += `and ${delaySeconds} seconds`;
        }
        user.send(warningMsg);
        let parsedMessages = this.GetMessages(messages);
        console.log(parsedMessages);
        this.SpamTime(user, amount, delay, parsedMessages);
    }
    GetMessages(input) {
        if (/"([^"]+)"/g.test(input)) {
            let regex = /"([^"]+)"/g;
            let messages = [];
            let msg;
            while (msg = regex.exec(input)) {
                messages.push(msg[1]);
            }
            return messages;
        }
        return [input];
    }
    async SpamTime(target, numMessages, delayBetweenMessages, messages) {
        let wait = (delayInMilliseconds) => new Promise((resolve, reject) => setTimeout(() => {
            resolve();
            this.CalculateAndSendMessage(messages, target);
        }, delayInMilliseconds));
        for (let index = 0; index < numMessages; index++) {
            let delayMs = delayBetweenMessages * 1000;
            await wait(delayMs);
        }
        target.send("I'm done spamming you now");
    }
    CalculateAndSendMessage(messages, target) {
        if (messages.length === 0) {
            target.send("The spammer wouldn't give any messages to spam");
        }
        else {
            let messageIndex = Math.floor(Math.random() * messages.length);
            target.send(messages[messageIndex]);
        }
    }
}
exports.Spam = Spam;
//# sourceMappingURL=spam.js.map