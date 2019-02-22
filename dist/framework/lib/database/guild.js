"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class GuildBucket {
    constructor(id) {
        this.rowExists = false;
        this.prefix = '!';
        this.voice = {
            volume: 50
        };
        this.notifications = {
            newYoutubeVideo: 'New video available! {{ link }}',
        };
        this.quotes = [];
        this.id = id;
    }
    async save() {
        let o = _.clone(this);
        _.each(o, (val, key) => {
            if (typeof val == 'function' || key == 'id' || key == 'rowExists') {
                delete o[key];
            }
        });
        let json = JSON.stringify(o, null, 4);
        let exists = this.rowExists;
        if (exists) {
            await database_1.Database.run('UPDATE guilds SET settings = ? WHERE id = ?', json, this.id);
        }
        else {
            this.rowExists = true;
            await database_1.Database.run('INSERT INTO guilds (id, settings) VALUES (?, ?)', this.id, json);
        }
    }
    async load() {
        let row = await database_1.Database.get('SELECT * FROM guilds WHERE id = ?', this.id);
        if (row) {
            this.rowExists = true;
            if (row.settings) {
                let settings = JSON.parse(row.settings);
                let o = _.defaultsDeep(settings, this);
                _.each(o, (val, key) => {
                    if (key == 'id' || key == 'rowExists')
                        return;
                    this[key] = val;
                });
            }
        }
    }
}
exports.GuildBucket = GuildBucket;
//# sourceMappingURL=guild.js.map