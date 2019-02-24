import { LoDashStatic } from 'lodash';

declare global {
    let _ : LoDashStatic;

    /**
     * Takes a relative path to a file in the `public` directory and returns the absolute path.
     */
    function pub(path: string): string;

    /**
     * Takes a relative path to a file in the `tmp` directory and returns the absolute path.
     */
    function tmp(path: string): string;

    /**
     * Returns a promise which resolves after the specified number of milliseconds.
     */
    function sleep(ms: number): Promise<void>;

    interface String {
        equals(other: string) : boolean;
        equalsIgnoreCase(other: string) : boolean;
    }
}
