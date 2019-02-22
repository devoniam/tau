"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class MemberBucket {
    constructor(id, guildId) {
        this.rowExists = false;
        this.currency = 0;
        this.inventory = [];
        this.level = 1;
        this.experience = 0;
        this.lastExperienceAwardTime = 0;
        this.lastDailyRedeemTime = 0;
        this.nameHistory = [];
        this.id = id;
        this.guildId = guildId;
    }
    async save() {
        let o = _.clone(this);
        _.each(o, (val, key) => {
            if (typeof val == 'function' || key == 'id' || key == 'rowExists' || key == 'guildId') {
                delete o[key];
            }
        });
        let json = JSON.stringify(o, null, 4);
        let exists = this.rowExists;
        if (exists) {
            await database_1.Database.run('UPDATE members SET settings = ? WHERE id = ? AND guild_id = ?', json, this.id, this.guildId);
        }
        else {
            this.rowExists = true;
            await database_1.Database.run('INSERT INTO members (id, guild_id, settings) VALUES (?, ?, ?)', this.id, this.guildId, json);
        }
    }
    async load() {
        let row = await database_1.Database.get('SELECT * FROM members WHERE id = ? AND guild_id = ?', this.id, this.guildId);
        if (row) {
            this.rowExists = true;
            if (row.settings) {
                let settings = JSON.parse(row.settings);
                let o = _.defaultsDeep(settings, this);
                _.each(o, (val, key) => {
                    if (key == 'id' || key == 'rowExists' || key == 'guildId')
                        return;
                    this[key] = val;
                });
            }
        }
    }
}
exports.MemberBucket = MemberBucket;
//# sourceMappingURL=member.js.map