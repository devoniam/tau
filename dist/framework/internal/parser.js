"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parser {
    constructor(command, message, content) {
        this.compiledArguments = [];
        this.parsedArguments = [];
        this.command = command;
        this.message = message;
        this.guild = message ? message.guild : undefined;
        this.content = content.trim();
        this.parsedContentBuffer = content;
        this.compiledArguments = this.getCompiledArguments();
        this.parse();
        if (!this.findErrors()) {
            this.evaluate();
        }
    }
    getError() {
        let failed;
        _.forEach(this.parsedArguments, parsed => {
            if (parsed.error) {
                failed = parsed;
                return false;
            }
        });
        if (failed) {
            if (failed.required && !failed.value) {
                let an = /^[aeiou]/i.test(failed.name) ? 'an' : 'a';
                return new Error(failed.errorMessage || 'Please enter ' + an + ' ' + failed.name + '.');
            }
            return new Error(failed.errorMessage || 'Please enter a valid ' + failed.name + '.');
        }
        return undefined;
    }
    getArguments() {
        return this.parsedArguments;
    }
    parse() {
        for (let i = 0; i < this.compiledArguments.length; i++) {
            let argument = this.compiledArguments[i];
            let regex = new RegExp(`^${argument.regex.source}(\\s|$)`, 'i');
            let an = /^[aeiou]/i.test(argument.name) ? 'an' : 'a';
            let parsed = {
                name: argument.name,
                value: undefined,
                error: false,
                required: argument.original.getRequired(),
                argument: argument.original
            };
            let matches = regex.exec(this.parsedContentBuffer);
            if (matches != null) {
                parsed.value = matches[1];
                parsed.parsedValue = argument.original.parse(matches[1], this.guild);
                this.parsedContentBuffer = this.parsedContentBuffer.substring(matches[0].length).trim();
                if ((parsed.required || parsed.argument.getShouldError()) && parsed.parsedValue == undefined) {
                    if (parsed.argument.getConstraints().indexOf('role') >= 0 || parsed.argument.getConstraints().indexOf('mention') >= 0) {
                        parsed.error = true;
                        parsed.errorMessage = `Please enter a valid ${argument.name}.`;
                    }
                }
            }
            else {
                if (argument.original.getRequired()) {
                    parsed.error = true;
                    parsed.errorMessage = (this.parsedContentBuffer.length == 0) ?
                        `Please enter ${an} ${argument.name}.` :
                        `Please enter a valid ${argument.name}.`;
                }
                parsed.parsedValue = argument.original.getDefaultValue();
                if (parsed.parsedValue == '@member' && this.message) {
                    parsed.parsedValue = this.message.member;
                }
            }
            this.parsedArguments.push(parsed);
            if (parsed.error && parsed.argument.getShouldError()) {
                break;
            }
        }
    }
    findErrors() {
        _.forEach(this.parsedArguments, parsed => {
            if (!parsed.error && parsed.required && parsed.parsedValue == undefined) {
                let an = /^[aeiou]/i.test(parsed.name) ? 'an' : 'a';
                parsed.error = true;
                parsed.errorMessage = `Please enter ${an} ${parsed.name}.`;
                return;
            }
            if (this.parsedContentBuffer.length == 0)
                return;
            if (parsed.error || parsed.required || parsed.value)
                return;
            if (!parsed.argument.getShouldError())
                return;
            parsed.error = true;
            return false;
        });
        return this.getError() ? true : false;
    }
    evaluate() {
        _.forEach(this.parsedArguments, parsed => {
            if (parsed.error || !parsed.value)
                return;
            let evaluator = parsed.argument.getEvaluator();
            if (evaluator) {
                try {
                    if (!evaluator(parsed.parsedValue, this.parsedArguments)) {
                        parsed.error = true;
                        parsed.errorMessage = parsed.argument.getErrorMessage() || `Please enter a valid ${parsed.name}.`;
                    }
                }
                catch (error) {
                    parsed.error = true;
                    parsed.errorMessage = error.message;
                }
            }
        });
    }
    getCompiledArguments() {
        let args = this.command.getArguments();
        let compiled = [];
        _.forEach(args, arg => {
            let exp = arg.getRegularExpression();
            compiled.push({
                name: arg.getName(),
                original: arg,
                regex: exp
            });
        });
        return compiled;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map