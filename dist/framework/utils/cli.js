"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandLine {
    static hasFlag(name) {
        name = name.toLowerCase();
        if (name in this.cachedFlags) {
            return this.cachedFlags[name];
        }
        for (let arg of process.argv) {
            if (arg.startsWith('--')) {
                if (arg.substring(2).toLowerCase() == name) {
                    return this.cachedFlags[name] = true;
                }
            }
        }
        return this.cachedFlags[name] = false;
    }
}
CommandLine.cachedFlags = {};
exports.CommandLine = CommandLine;
//# sourceMappingURL=cli.js.map