"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const cron_1 = require("cron");
class Job {
    constructor(options) {
        this.options = options;
        this.logger = new logger_1.Logger('job:' + this.options.name);
    }
    start() {
        new cron_1.CronJob(this.options.time, this.execute.bind(this), null, true, this.options.timezone || 'America/Phoenix');
    }
    execute() {
    }
    getLogger() {
        return this.logger;
    }
}
exports.Job = Job;
