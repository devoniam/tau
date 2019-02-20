"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Input {
    constructor(message) {
        this.command = null;
        this.prefix = '';
        this.commandName = '';
        this.text = '';
        this.args = [];
        this.compatible = true;
        this.message = message;
        this.member = message.member;
        this.guild = message.guild;
        this.channel = message.channel;
        this.parse();
    }
    parse() {
        this.prefix = this.message.content.substring(0, 1);
        let content = this.message.content.substring(1) + ' ';
        let space = content.indexOf(' ');
        this.commandName = content.substring(0, space);
        this.text = content.substring(space).trim();
        let { Framework } = require('../framework');
        this.command = Framework.findCommand(this.commandName);
        if (this.command) {
            let args = this.command.getArguments();
            let remaining = this.text.trim();
            args.forEach(arg => {
                if (!this.compatible) {
                    return;
                }
                let expressions = this.generateExpressions(arg);
                let matched = false;
                let value = arg.default;
                let supplied = (remaining.length > 0);
                for (let i = 0; i < expressions.length; i++) {
                    let expressionString = expressions[i];
                    let expression = new RegExp(expressionString, this.generateFlags(arg));
                    let match = expression.exec(remaining);
                    if (match) {
                        value = match[1];
                        let passesEval = () => {
                            if (typeof arg.eval == 'function') {
                                return arg.eval(value);
                            }
                            return true;
                        };
                        if (typeof arg.options == 'object') {
                            if (arg.options.indexOf(value) < 0) {
                                continue;
                            }
                            else {
                                remaining = remaining.substring(match.index + value.length).trim();
                                matched = true;
                                break;
                            }
                        }
                        if (this.compatible && arg.constraint) {
                            if (arg.constraint == 'boolean') {
                                value = value.toLowerCase();
                                value = ['yes', '1', 'true', 'on'].indexOf(value) >= 0;
                            }
                            else if (arg.constraint == 'mention') {
                                let idMatches = /<@!?(\d+)>/.exec(value);
                                let id = idMatches[1];
                                value = this.message.guild.members.get(id);
                            }
                            else if (arg.constraint == 'number') {
                                value = (value.indexOf('.') >= 0) ? parseFloat(value) : parseInt(value);
                            }
                            else if (arg.constraint == 'role') {
                                let idMatches = /<@&(\d+)>/.exec(value);
                                let id = idMatches[1];
                                value = this.message.guild.roles.get(id);
                            }
                            if (passesEval()) {
                                remaining = remaining.substring(match.index + value.length).trim();
                                matched = true;
                                break;
                            }
                        }
                        else if (this.compatible) {
                            if (passesEval()) {
                                remaining = remaining.substring(match.index + value.length).trim();
                                matched = true;
                                break;
                            }
                        }
                    }
                }
                if (!matched) {
                    if (arg.required || (arg.error && supplied)) {
                        this.compatible = false;
                    }
                    if (arg.default == '@member') {
                        value = this.message.member;
                    }
                }
                this.args.push({
                    name: arg.name,
                    value: (matched) ? value : undefined
                });
            });
        }
    }
    getCommandName() {
        return this.commandName;
    }
    getCommand() {
        return this.command;
    }
    getPrefix() {
        return this.prefix;
    }
    getText() {
        return this.text;
    }
    getArgument(name) {
        for (let i = 0; i < this.args.length; i++) {
            let arg = this.args[i];
            if (arg.name.toLowerCase() == name.toLowerCase()) {
                return arg.value;
            }
        }
        return undefined;
    }
    isProper() {
        return this.compatible;
    }
    generateExpressions(arg) {
        if (arg.expand)
            return ['^(.+)$'];
        if (arg.pattern) {
            let pattern = arg.pattern.toString();
            let lastSlash = pattern.lastIndexOf('/');
            pattern = pattern.substring(1, lastSlash);
            return ['^' + pattern + '(\\s|$)'];
        }
        if (arg.constraint) {
            return this.getConstraintExpressions(arg);
        }
        return ['^("[^"]+"|[^\\s"]+)(\\s|$)'];
    }
    generateFlags(arg) {
        if (arg.expand)
            return undefined;
        if (arg.pattern) {
            let originalPattern = arg.pattern.toString();
            let lastSlash = originalPattern.lastIndexOf('/');
            let flags = undefined;
            if (lastSlash < (originalPattern.length - 1)) {
                flags = originalPattern.substring(lastSlash + 1);
            }
            return flags;
        }
        return 'i';
    }
    getConstraintExpressions(arg) {
        if (arg.constraint) {
            if (typeof arg.constraint == 'object') {
                let expressions = [];
                arg.constraint.forEach((constraint) => {
                    expressions.push(this.getConstraintExpression(constraint));
                });
                return expressions;
            }
            return [this.getConstraintExpression(arg.constraint)];
        }
        return [];
    }
    getConstraintExpression(constraint) {
        if (constraint == 'number')
            return '^(\\d+)(\\s|$)';
        if (constraint == 'alphanumeric')
            return '^([a-zA-Z0-9._-]+)(\\s|$)';
        if (constraint == 'char')
            return '^(.)(\\s|$)';
        if (constraint == 'mention')
            return '^(<@!?\\d+>)(\\s|$)';
        if (constraint == 'role')
            return '^(<@&\\d+>)(\\s|$)';
        if (constraint == 'boolean')
            return '^(yes|no|1|0|true|false|on|off)(\\s|$)';
        if (constraint == 'url')
            return '^((http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?)(\\\\s|$)';
        if (constraint == 'emoji')
            return '^((?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\u0023-\\u0039]\\ufe0f?\\u20e3|\\u3299|\\u3297|\\u303d|\\u3030|\\u24c2|\\ud83c[\\udd70-\\udd71]|\\ud83c[\\udd7e-\\udd7f]|\\ud83c\\udd8e|\\ud83c[\\udd91-\\udd9a]|\\ud83c[\\udde6-\\uddff]|[\\ud83c[\\ude01-\\ude02]|\\ud83c\\ude1a|\\ud83c\\ude2f|[\\ud83c[\\ude32-\\ude3a]|[\\ud83c[\\ude50-\\ude51]|\\u203c|\\u2049|[\\u25aa-\\u25ab]|\\u25b6|\\u25c0|[\\u25fb-\\u25fe]|\\u00a9|\\u00ae|\\u2122|\\u2139|\\ud83c\\udc04|[\\u2600-\\u26FF]|\\u2b05|\\u2b06|\\u2b07|\\u2b1b|\\u2b1c|\\u2b50|\\u2b55|\\u231a|\\u231b|\\u2328|\\u23cf|[\\u23e9-\\u23f3]|[\\u23f8-\\u23fa]|\\ud83c\\udccf|\\u2934|\\u2935|[\\u2190-\\u21ff]))(\\s|$)';
        return '^("[^"]+"|[^\\s"]+)(\\s|$)';
    }
}
exports.Input = Input;
