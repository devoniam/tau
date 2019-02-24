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
    getPermission() {
        if (!this.options.permission)
            return;
        switch (this.options.permission) {
            case 'createInstantInvite': return 1 << 0;
            case 'kickMembers': return 1 << 1;
            case 'banMembers': return 1 << 2;
            case 'administrator': return 1 << 3;
            case 'manageChannels': return 1 << 4;
            case 'manageGuild': return 1 << 5;
            case 'addReactions': return 1 << 6;
            case 'viewAuditLog': return 1 << 7;
            case 'prioritySpeaker': return 1 << 8;
            case 'readMessages': return 1 << 10;
            case 'sendMessages': return 1 << 11;
            case 'sendTtsMessages': return 1 << 12;
            case 'manageMessages': return 1 << 13;
            case 'embedLinks': return 1 << 14;
            case 'attachFiles': return 1 << 15;
            case 'readMessageHistory': return 1 << 16;
            case 'mentionEveryone': return 1 << 17;
            case 'useExternalEmojis': return 1 << 18;
            case 'connect': return 1 << 20;
            case 'speak': return 1 << 21;
            case 'muteMembers': return 1 << 21;
            case 'deafenMembers': return 1 << 23;
            case 'moveMembers': return 1 << 24;
            case 'useVad': return 1 << 25;
            case 'changeNickname': return 1 << 26;
            case 'manageNicknames': return 1 << 27;
            case 'manageRoles': return 1 << 28;
            case 'manageWebhooks': return 1 << 29;
            case 'manageEmojis': return 1 << 30;
        }
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