"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Documentation {
    static getCommandOverview(command) {
        let usage = '`' + this.getInlineUsage(command) + '`';
        return `${command.getDescription()}\n\nUsage:  ${usage}`;
    }
    static getArgumentList(command) {
        let result = '';
        command.getArguments().forEach(arg => {
            let options = arg.getOptions();
            result += `_  _**→**  \`${arg.getName()}\`` + (arg.getDescription() ? `  :  ${arg.getDescription()}` : '');
            result += '\n';
            if (options && options.length > 1) {
                options.forEach((option) => {
                    result += `_         _• \`${option}\`\n`;
                });
                result += '\n';
            }
        });
        return result.trim();
    }
    static getArgumentDetails(command) {
        return this.getArgumentList(command);
    }
    static getInlineUsage(command) {
        let usage = command.getName();
        let args = [];
        command.getArguments().forEach(arg => {
            args.push(arg.getUsage());
        });
        return `${usage} ${args.join(' ')}`.trim();
    }
    static getCommandHelp(command) {
        let help = Documentation.getCommandOverview(command);
        help += '\n\n';
        help += Documentation.getArgumentDetails(command);
        return help;
    }
}
exports.Documentation = Documentation;
//# sourceMappingURL=documentation.js.map