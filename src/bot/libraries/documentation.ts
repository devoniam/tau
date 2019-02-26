import { Command } from "@api";

/**
 * This class is a helper library to generate help and usage information for commands.
 */
export class Documentation {

    /**
     * Returns an overview of the command with its usage and description.
     */
    public static getCommandOverview(command: Command) {
        let usage = '`' + this.getInlineUsage(command) + '`';
        return `${command.getDescription()}\n\nUsage:  ${usage}`;
    }

    /**
     * Returns a list of arguments for the command with their type and default.
     */
    public static getArgumentList(command: Command) {
        let result = '';

        command.getArguments().forEach(arg => {
            let options = arg.getOptions();

            result += `_  _**→**  \`${arg.getName()}\`` + (arg.getDescription() ? `  :  ${arg.getDescription()}` : '');
            result += '\n';

            if (options && options.length > 1) {
                options.forEach((option : any) => {
                    result += `_         _• \`${option}\`\n`;
                });

                result += '\n';
            }
        });

        return result.trim();
    }

    /**
     * Returns a list of arguments with full details, including type, default, description, and options.
     */
    public static getArgumentDetails(command: Command) {
        return this.getArgumentList(command);
    }

    /**
     * Returns the command's usage as a string in inline format, which can be surrounded with backticks for formatting.
     */
    public static getInlineUsage(command: Command) {
        let usage = command.getName();
        let args : string[] = [];

        command.getArguments().forEach(arg => {
            args.push(arg.getUsage());
        });

        return `${usage} ${args.join(' ')}`.trim();
    }

    /**
     * Returns a string with the full detailed help information for a command.
     */
    public static getCommandHelp(command: Command) {
        let help = Documentation.getCommandOverview(command);
        help += '\n\n';
        help += Documentation.getArgumentDetails(command);

        return help;
    }

}
