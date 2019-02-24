import { LoDashStatic } from 'lodash';

declare global {
    let _ : LoDashStatic;

    /**
     * Takes a relative path to a file in the `public` directory and returns the absolute path.
     */
    function pub(path: string): string;

    interface String {
        equals(other: string) : boolean;
        equalsIgnoreCase(other: string) : boolean;
    }
}
