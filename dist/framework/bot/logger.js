"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@core/framework");
const chalk_1 = require("chalk");
const readline = require("readline");
class Logger {
    constructor(id) {
        this.id = id;
    }
    info(message, ...params) {
        console.log.apply(console, this.build('info', message, params));
    }
    debug(message, ...params) {
        if (framework_1.Framework.getLoggingLevel() != 'verbose' && framework_1.Framework.getLoggingLevel() != 'debug')
            return;
        console.log.apply(console, this.build('debug', message, params));
    }
    verbose(message, ...params) {
        if (framework_1.Framework.getLoggingLevel() != 'verbose')
            return;
        console.log.apply(console, this.build('verbose', message, params));
    }
    warning(message, ...params) {
        console.log.apply(console, this.build('warning', message, params));
    }
    error(message, ...params) {
        console.log.apply(console, this.build('error', message, params));
    }
    clear() {
        readline.cursorTo(process.stdout, 0);
        readline.moveCursor(process.stdout, 0, -1);
        readline.clearLine(process.stdout, 0);
    }
    build(level, message, params) {
        let tagId = this.id ? `${chalk_1.default.gray(this.id)} ` : '';
        let tagLevel = this.color(level);
        let entry = `${tagId + tagLevel}`;
        if (typeof message === 'string') {
            entry += (' ' + message);
            params.unshift(entry);
        }
        else {
            params.unshift(message);
        }
        return params;
    }
    color(level) {
        let color = chalk_1.default.reset;
        switch (level) {
            case 'info':
                color = chalk_1.default.blue;
                break;
            case 'debug':
                color = chalk_1.default.green;
                break;
            case 'verbose':
                color = chalk_1.default.magenta;
                break;
            case 'warning':
                color = chalk_1.default.yellow;
                break;
            case 'error':
                color = chalk_1.default.red;
                break;
        }
        return color(level + ':');
    }
}
exports.Logger = Logger;
