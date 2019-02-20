"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
class Command {
    constructor(options) {
        this.options = options;
        this.logger = new logger_1.Logger('command:' + this.options.name);
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
        return this.options.arguments || [];
    }
    getUsage() {
        let usage = this.getName();
        let args = [];
        this.getArguments().forEach(arg => {
            let text = arg.usage ? arg.usage : arg.name;
            if (!arg.usage) {
                if (!arg.options && arg.expand && !arg.default) {
                    text += '...';
                }
                if (arg.options) {
                    text = arg.options.join('|');
                }
                if (arg.default && !arg.required) {
                    if (arg.default == '@member') {
                        text += ' = you';
                    }
                    else {
                        text += ' = ' + arg.default;
                    }
                }
            }
            if (arg.required)
                args.push('<' + text + '>');
            else
                args.push('[' + text + ']');
        });
        return `${usage} ${args.join(' ')}`.trim();
    }
}
exports.Command = Command;
//# sourceMappingURL=command.js.map