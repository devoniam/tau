import { LoDashStatic } from 'lodash';

declare global {
    let _ : LoDashStatic;

    /**
     * Takes a relative path to a file in the `public` directory and returns the absolute path.
     */
    function pub(path: string): string;

    /**
     * Returns an absolute path to the given file. The given file is a path relative to the bot's root directory.
     */
    function rootpath(path: string): string;

    /**
     * Returns a promise which resolves after the specified number of milliseconds.
     */
    function sleep(ms: number): Promise<void>;

    interface String {
        equals(other: string) : boolean;
        equalsIgnoreCase(other: string) : boolean;
        capitalize() : string;
    }
}
