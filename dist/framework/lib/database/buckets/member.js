"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bucket_1 = require("../bucket");
class MemberBucket extends bucket_1.Bucket {
    constructor() {
        super(...arguments);
        this.table = 'members';
        this.currency = 0;
        this.inventory = [];
    }
}
exports.MemberBucket = MemberBucket;
