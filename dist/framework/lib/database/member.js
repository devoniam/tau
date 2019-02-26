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
        let r = () => { };
        let p = new Promise(resolve => {
            r = resolve;
        });
        this.id = id;
        this.guildId = guildId;
        this.status = {
            loaded: false,
            loading: false,
            promise: p,
            resolver: r
        };
    }
    async save() {
        if (!this.status.loaded) {
            throw new Error('Attempted to save a MemberBucket which has not been loaded.');
        }
        let o = _.clone(this);
        _.each(o, (val, key) => {
            if (typeof val == 'function' || key == 'id' || key == 'rowExists' || key == 'guildId' || key == 'status') {
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
        if (this.status.loaded)
            return;
        if (this.status.loading)
            return await this.status.promise;
        this.status.loading = true;
        let row = await database_1.Database.get('SELECT * FROM members WHERE id = ? AND guild_id = ?', this.id, this.guildId);
        if (row) {
            this.rowExists = true;
            if (row.settings) {
                let settings = JSON.parse(row.settings);
                let o = _.defaultsDeep(settings, this);
                _.each(o, (val, key) => {
                    if (key == 'id' || key == 'rowExists' || key == 'guildId' || key == 'status')
                        return;
                    this[key] = val;
                });
            }
        }
        this.status.loaded = true;
        this.status.resolver();
    }
    async wait() {
        if (!this.status.loaded) {
            await this.status.promise;
        }
    }
}
exports.MemberBucket = MemberBucket;
//# sourceMappingURL=member.js.map