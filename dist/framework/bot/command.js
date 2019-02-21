"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const argument_1 = require("@core/internal/argument");
class Command {
    constructor(options) {
        this.options = options;
        this.logger = new logger_1.Logger('command:' + this.options.name);
        this.arguments = [];
        if (this.options.arguments) {
            _.forEach(this.options.arguments, argument => {
                this.arguments.push(new argument_1.Argument(argument));
            });
        }
    }
    execute(input) {
        input.channel.send('This command is not yet implemented.');
    }
    getLogger() {
        return this.logger;
    }
    getName() {
        return this.options.name.toLowerCase();
    }
    getAliases() {
        let names = [this.getName().toLowerCase()];
        if (this.options.aliases) {
            this.options.aliases.forEach(alias => {
                names.push(alias.toLowerCase());
            });
        }
        return names;
    }
    hasAlias(alias) {
        return this.getAliases().indexOf(alias.toLowerCase()) >= 0;
    }
    getDescription() {
        return this.options.description;
    }
    getArguments() {
        return this.arguments;
    }
    getUsage() {
        let usage = this.getName();
        let args = [];
        this.getArguments().forEach(arg => {
            args.push(arg.getUsage());
        });
        return `${usage} ${args.join(' ')}`.trim();
    }
}
exports.Command = Command;
//# sourceMappingURL=command.js.map