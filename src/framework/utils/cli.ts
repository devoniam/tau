export class CommandLine {
    private static cachedFlags: { [name: string]: boolean } = {};

    /**
     * Checks if the current process has a flag with the given name (--name).
     */
    public static hasFlag(name: string): boolean {
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
