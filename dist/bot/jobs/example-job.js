"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class ExampleJob extends _api_1.Job {
    constructor() {
        super({
            name: 'example',
            time: '0 * * * * *'
        });
    }
    execute() {
    }
}
exports.ExampleJob = ExampleJob;
//# sourceMappingURL=example-job.js.map