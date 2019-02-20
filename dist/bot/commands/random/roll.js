"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Roll extends _api_1.Command {
    constructor() {
        super({
            name: 'roll',
            description: 'Rolls one or more dice and returns the result.',
            arguments: [
                {
                    name: 'dice',
                    description: 'The number of dice to roll.',
                    constraint: 'number',
                    default: 1,
                    eval: (input) => input >= 1 && input <= 10
                }
            ]
        });
    }
    execute(input) {
        let dice = input.getArgument('dice');
        input.channel.send('Not yet implemented.');
    }
}
exports.Roll = Roll;
//# sourceMappingURL=roll.js.map