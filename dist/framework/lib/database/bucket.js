"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bucket {
    constructor(id) {
        this.table = '';
        this.id = id;
    }
    save() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    load() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}
exports.Bucket = Bucket;
