import { Database as SqliteDb } from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs';

const queue = require('queue')({ concurrency: 1, autostart: true, timeout: 60000 });

export class Database {
    private static file: SqliteDb;

    /**
     * Runs the given query and does not retrieve any results.
     */
    public static run(query: string, ...bindings: any[]) : Promise<void> {
        return new Promise((resolve, reject) => {
            queue.push((cb : () => void) => {
                this.getFile().run(query, bindings, (error) => {
                    if (error == null) resolve();
                    else reject(error);

                    cb();
                });
            });
        });
    }

    /**
     * Runs the given query and resolves with an object representing the first row or `undefined` if no rows were
     * matched.
     */
    public static get<T = any>(query: string, ...bindings: any[]) : Promise<T|undefined> {
        return new Promise((resolve, reject) => {
            queue.push((cb : () => void) => {
                this.getFile().get(query, bindings, (error, row) => {
                    if (error == null) resolve(row);
                    else reject(error);

                    cb();
                });
            });
        });
    }

    /**
     * Runs the given query and resolves with an array of all matched rows.
     */
    public static all<T = any>(query: string, ...bindings: any[]) : Promise<T[]> {
        return new Promise((resolve, reject) => {
            queue.push((cb : () => void) => {
                this.getFile().all(query, bindings, (error, row) => {
                    if (error == null) resolve(row);
                    else reject(error);

                    cb();
                });
            });
        });
    }

    /**
     * Closes the database.
     */
    public static close() : Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.file) return resolve();

            this.file.close((err) => {
                if (err == null) resolve();
                else reject(err);
            });
        });
    }

    /**
     * Returns the database file, and opens it automatically if needed.
     */
    private static getFile() : SqliteDb {
        if (!this.file) {
            let filePath = path.join(__dirname, '../../../data/storage');
            let templatePath = path.join(__dirname, '../../../data/template');

            // If the database file doesn't exist, create it from the template
            if (!fs.existsSync(filePath)) {
                fs.copyFileSync(templatePath, filePath);
            }

            // Open the database file
            this.file = new SqliteDb(filePath);
        }

        return this.file;
    }

}
