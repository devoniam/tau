"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Argument {
    constructor(options) {
        this.options = options;
    }
    getName() {
        return this.options.name;
    }
    getDescription() {
        return this.options.description;
    }
    getRequired() {
        return this.options.required || false;
    }
    getPatterns() {
        let patterns = this.options.patterns || this.options.pattern;
        if (!patterns) {
            return [];
        }
        if (patterns instanceof Array) {
            return patterns;
        }
        return [patterns];
    }
    getRegularExpression() {
        let expressions = this.getRegularExpressions();
        let compiled = [];
        _.each(expressions, expression => {
            compiled.push(expression.source);
        });
        let source = compiled.join('|');
        let expression = new RegExp(`(${source})`, 'i');
        return expression;
    }
    getRegularExpressions() {
        if (this.options.options)
            return [this.getOptionsExpression()];
        if (this.options.patterns)
            return this.getPatterns();
        if (this.options.constraint)
            return _.values(this.getConstraintExpressions());
        return [/("[^"]+"|[^\s"]+)/];
    }
    getOptions() {
        return this.options.options;
    }
    getExpansive() {
        return this.options.expand || false;
    }
    getShouldError() {
        return this.options.required || (this.options.error || false);
    }
    getErrorMessage() {
        return this.options.message;
    }
    getUsage() {
        let components = [];
        components.push(this.getRequired() ? '<' : '[');
        if (this.getOptions())
            components.push(this.getOptions().join('|'));
        else if (_.isEqual(this.getConstraints(), ['mention']))
            components.push('@' + this.getName());
        else
            components.push(this.getName());
        if (this.getDefaultValue() != undefined) {
            let d = '' + this.getDefaultValue();
            if (d == '@mention')
                d = 'you';
            components.push(' = ' + d);
        }
        components.push(this.getRequired() ? '>' : ']');
        return components.join('');
    }
    getEvaluator() {
        return this.options.eval;
    }
    getConstraints() {
        let constraint = this.options.constraint || [];
        if (typeof constraint == 'object') {
            return constraint;
        }
        return [constraint];
    }
    getConstraintExpressions() {
        let expressions = {};
        _.forEach(this.getConstraints(), constraint => {
            let expression;
            switch (constraint) {
                case 'number':
                    expression = /([\d.-]+)/;
                    break;
                case 'alphanumeric':
                    expression = /^([a-zA-Z0-9._-]+)/;
                    break;
                case 'char':
                    expression = /(.)/;
                    break;
                case 'mention':
                    expression = /(<@!?\d+>)/;
                    break;
                case 'role':
                    expression = /(<@&\d+>)/;
                    break;
                case 'boolean':
                    expression = /(yes|no|1|0|true|false|on|off)/;
                    break;
                case 'url':
                    expression = /((http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?)/;
                    break;
                case 'emoji':
                    expression = /((?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]))/;
                    break;
                default:
                    expression = /("[^"]+"|[^\s"]+)/;
                    break;
            }
            expressions[constraint] = new RegExp(expression.source, 'i');
        });
        return expressions;
    }
    getOptionsExpression() {
        if (this.options.options) {
            let prepared = [];
            _.forEach(this.options.options, opt => {
                prepared.push(`${opt}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            });
            return new RegExp('(' + prepared.join('|') + ')', 'i');
        }
        return undefined;
    }
    getDefaultValue() {
        return this.options.default;
    }
    parse(content, guild) {
        let expressions = this.getConstraintExpressions();
        let match = content;
        _.forEach(expressions, (expression, constraint) => {
            let matches = expression.exec(content);
            if (matches) {
                let value = matches[1];
                match = this.parseForConstraint(value, constraint, guild);
                return false;
            }
        });
        return match;
    }
    parseForConstraint(content, constraint, guild) {
        let lower = content.toLowerCase();
        switch (constraint) {
            case 'number':
                return (content.indexOf('.') >= 0) ? parseFloat(content) : parseInt(content);
            case 'mention':
                return (guild) ? guild.members.get(/<@!?(\d+)>/.exec(content)[1]) : undefined;
            case 'role':
                return (guild) ? guild.roles.get(/<@&(\d+)>/.exec(content)[1]) : undefined;
            case 'boolean':
                return (lower == 'yes' || lower == '1' || lower == 'true' || lower == 'on');
        }
        return content;
    }
}
exports.Argument = Argument;
//# sourceMappingURL=argument.js.map