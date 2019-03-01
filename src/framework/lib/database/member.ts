import { Database } from "../database";

export class MemberBucket {
    protected id: string;
    protected guildId: string;
    protected rowExists: boolean = false;
    protected status: Status;

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
        let r : Function = () => {};
        let p : Promise<void> = new Promise(resolve => {
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

    /**
     * Saves the current state of the guild.
     */
    public async save(): Promise<void> {
        // Throw an error if we haven't already loaded
        if (!this.status.loaded) {
            throw new Error('Attempted to save a MemberBucket which has not been loaded.');
        }

        // Duplicate this object
        let o : any = _.clone(this);

        // Remove functions and irrelevant variables
        _.each(o, (val, key) => {
            if (typeof val == 'function' || key == 'id' || key == 'rowExists' || key == 'guildId' || key == 'status') {
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
        // Skip if already loaded
        if (this.status.loaded) return;
        if (this.status.loading) return await this.status.promise;

        // Start loading
        this.status.loading = true;

        // Get the database row
        let row = await Database.get<MemberRow>('SELECT * FROM members WHERE id = ? AND guild_id = ?', this.id, this.guildId);

        // If the row exists, parse its data
        if (row) {
            this.rowExists = true;

            if (row.settings) {
                let settings = JSON.parse(row.settings);
                let o = _.defaultsDeep(settings, this);

                _.each(o, (val, key) => {
                    if (key == 'id' || key == 'rowExists' || key == 'guildId' || key == 'status') return;
                    (this as any)[key] = val;
                });
            }
        }

        // Set the status and resolve the loading promise
        this.status.loaded = true;
        this.status.resolver();
    }

    /**
     * Waits for the member to finish loading.
     */
    public async wait() {
        if (!this.status.loaded) {
            await this.status.promise;
        }
    }
}

export type InventoryItem = {
    item: number;
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

type Status = {
    loaded: boolean;
    loading: boolean;
    promise: Promise<void>;
    resolver: Function;
}
