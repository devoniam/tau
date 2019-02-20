"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class Between extends _api_1.Command {
    constructor() {
        super({
            name: 'between',
            description: 'Generates a random number between `x` and `y`.',
            arguments: [
                {
                    name: 'x',
                    description: 'The minimum value.',
                    constraint: 'number',
                    required: true
                },
                {
                    name: 'y',
                    description: 'The maximum value.',
                    constraint: 'number',
                    required: true
                }
            ]
        });
    }
    execute(input) {
        let x = input.getArgument('x');
        let y = input.getArgument('y');
        input.channel.send('Not yet implemented.');
    }
}
exports.Between = Between;
//# sourceMappingURL=between.js.map