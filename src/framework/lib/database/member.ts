import { Database } from "../database";

export class MemberBucket {
    protected id: string;
    protected guildId: string;
    protected rowExists: boolean = false;

    /**
     * The balance of the member.
     */
    public currency: number = 0;

    /**
     * An array of inventory items the user owns.
     */
    public inventory: InventoryItem[] = [];

    /**
     * The current level of the member.
     */
    public level: number = 1;

    /**
     * The current experience points of the member.
     */
    public experience: number = 0;

    /**
     * The last time (in milliseconds) that experience was awarded for posting a message.
     */
    public lastExperienceAwardTime: number = 0;

    /**
     * The last time (in milliseconds) that the user redeemed free daily currency.
     */
    public lastDailyRedeemTime: number = 0;

    /**
     * An array of the member's known name changes.
     */
    public nameHistory: NameRecord[] = [];

    constructor(id: string, guildId: string) {
        this.id = id;
        this.guildId = guildId;
    }

    /**
     * Saves the current state of the guild.
     */
    public async save(): Promise<void> {
        // Duplicate this object
        let o : any = _.clone(this);

        // Remove functions and irrelevant variables
        _.each(o, (val, key) => {
            if (typeof val == 'function' || key == 'id' || key == 'rowExists' || key == 'guildId') {
                delete o[key];
            }
        });

        // Encode with JSON
        let json = JSON.stringify(o, null, 4);

        // Does the row exist?
        let exists = this.rowExists;

        // Run the query
        if (exists) {
            await Database.run('UPDATE members SET settings = ? WHERE id = ? AND guild_id = ?', json, this.id, this.guildId);
        }
        else {
            this.rowExists = true;
            await Database.run('INSERT INTO members (id, guild_id, settings) VALUES (?, ?, ?)', this.id, this.guildId, json);
        }
    }

    /**
     * Loads the guild's data from the database.
     */
    public async load(): Promise<void> {
        let row = await Database.get<MemberRow>('SELECT * FROM members WHERE id = ? AND guild_id = ?', this.id, this.guildId);

        if (row) {
            this.rowExists = true;

            if (row.settings) {
                let settings = JSON.parse(row.settings);
                let o = _.defaultsDeep(settings, this);

                _.each(o, (val, key) => {
                    if (key == 'id' || key == 'rowExists' || key == 'guildId') return;
                    (this as any)[key] = val;
                });
            }
        }
    }
}

export type InventoryItem = {
    item: string;
    amount: number;
}

export type NameRecord = {
    name: string;
    time: number;
}

export type MemberRow = {
    id: string;
    guild_id: string;
    settings?: string;
}
