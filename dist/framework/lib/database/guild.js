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
        let r = () => { };
        let p = new Promise(resolve => {
            r = resolve;
        });
        this.id = id;
        this.status = {
            loaded: false,
            loading: false,
            promise: p,
            resolver: r
        };
    }
    async save() {
        if (!this.status.loaded) {
            throw new Error('Attempted to save a GuildBucket which has not been loaded.');
        }
        let o = _.clone(this);
        _.each(o, (val, key) => {
            if (typeof val == 'function' || key == 'id' || key == 'rowExists' || key == 'status') {
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
        if (this.status.loaded)
            return;
        if (this.status.loading)
            return await this.status.promise;
        this.status.loading = true;
        let row = await database_1.Database.get('SELECT * FROM guilds WHERE id = ?', this.id);
        if (row) {
            this.rowExists = true;
            if (row.settings) {
                let settings = JSON.parse(row.settings);
                let o = _.defaultsDeep(settings, this);
                _.each(o, (val, key) => {
                    if (key == 'id' || key == 'rowExists' || key == 'status')
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
exports.GuildBucket = GuildBucket;
//# sourceMappingURL=guild.js.map