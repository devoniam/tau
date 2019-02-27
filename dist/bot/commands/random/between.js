"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const emoji_1 = require("@bot/libraries/emoji");
class Between extends _api_1.Command {
    constructor() {
        super({
            name: 'between',
            description: 'Generates a random number between `x` and `y`, `Min: 0` `Max: 1000` ',
            arguments: [
                {
                    name: 'x',
                    description: 'The minimum value.',
                    constraint: 'number',
                    required: true,
                    eval: (input) => {
                        if (input < 0) {
                            throw new Error('`x` must be 0 or greater.');
                        }
                        return true;
                    }
                },
                {
                    name: 'y',
                    description: 'The maximum value.',
                    constraint: 'number',
                    required: true,
                    eval: (input) => {
                        if (input > 1000) {
                            throw new Error('`y` must be 1000 or less.');
                        }
                        return true;
                    }
                }
            ]
        });
    }
    execute(input) {
        let x = input.getArgument('x');
        let y = input.getArgument('y');
        if (x > y) {
            input.channel.send(emoji_1.Emoji.ERROR + " `x` cannot be greater than `y`: `between <x> <y>`");
        }
        else {
            let rnd = Math.floor((Math.random() * y) + x);
            input.channel.send(rnd);
        }
    }
}
exports.Between = Between;
//# sourceMappingURL=between.js.map