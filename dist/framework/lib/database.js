"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("sqlite3");
const path = require("path");
const fs = require("fs");
const queue = require('queue')({ concurrency: 1, autostart: true, timeout: 60000 });
class Database {
    static run(query, ...bindings) {
        return new Promise((resolve, reject) => {
            queue.push((cb) => {
                this.getFile().run(query, bindings, (error) => {
                    if (error == null)
                        resolve();
                    else
                        reject(error);
                    cb();
                });
            });
        });
    }
    static get(query, ...bindings) {
        return new Promise((resolve, reject) => {
            queue.push((cb) => {
                this.getFile().get(query, bindings, (error, row) => {
                    if (error == null)
                        resolve(row);
                    else
                        reject(error);
                    cb();
                });
            });
        });
    }
    static all(query, ...bindings) {
        return new Promise((resolve, reject) => {
            queue.push((cb) => {
                this.getFile().all(query, bindings, (error, row) => {
                    if (error == null)
                        resolve(row);
                    else
                        reject(error);
                    cb();
                });
            });
        });
    }
    static close() {
        return new Promise((resolve, reject) => {
            if (!this.file)
                return resolve();
            this.file.close((err) => {
                if (err == null)
                    resolve();
                else
                    reject(err);
            });
        });
    }
    static getFile() {
        if (!this.file) {
            let filePath = path.join(__dirname, '../../../data/storage');
            let templatePath = path.join(__dirname, '../../../data/template');
            if (!fs.existsSync(filePath)) {
                fs.copyFileSync(templatePath, filePath);
            }
            this.file = new sqlite3_1.Database(filePath);
        }
        return this.file;
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map