import { Database } from "../database";

export class GuildBucket {
    protected id: string;
    protected rowExists: boolean = false;

    /**
     * The prefix to use for the guild.
     */
    public prefix: string = '!';

    /**
     * The voice settings to use for the guild.
     */
    public voice: GuildVoiceSettings = {
        volume: 50
    };

    /**
     * The notification messages to use for the guild.
     */
    public notifications: GuildNotificationSettings = {
        newYoutubeVideo: 'New video available! {{ link }}',
    };

    /**
     * The quotes saved to the guild.
     */
    public quotes: GuildQuote[] = [];

    /**
     * Constructs a new GuildBucket instance.
     */
    constructor(id: string) {
        this.id = id;
    }

    /**
     * Saves the current state of the guild.
     */
    public async save(): Promise<void> {
        // Duplicate this object
        let o : any = _.clone(this);

        // Remove functions and irrelevant variables
        _.each(o, (val, key) => {
            if (typeof val == 'function' || key == 'id' || key == 'rowExists') {
                delete o[key];
            }
        });

        // Encode with JSON
        let json = JSON.stringify(o, null, 4);

        // Does the row exist?
        let exists = this.rowExists;

        // Run the query
        if (exists) {
            await Database.run('UPDATE guilds SET settings = ? WHERE id = ?', json, this.id);
        }
        else {
            this.rowExists = true;
            await Database.run('INSERT INTO guilds (id, settings) VALUES (?, ?)', this.id, json);
        }
    }

    /**
     * Loads the guild's data from the database.
     */
    public async load(): Promise<void> {
        let row = await Database.get<GuildRow>('SELECT * FROM guilds WHERE id = ?', this.id);

        if (row) {
            this.rowExists = true;

            if (row.settings) {
                let settings = JSON.parse(row.settings);
                let o = _.defaultsDeep(settings, this);

                _.each(o, (val, key) => {
                    if (key == 'id' || key == 'rowExists') return;
                    (this as any)[key] = val;
                });
            }
        }
    }
}

export type GuildVoiceSettings = {
    /**
     * The default volume for the bot when streaming music on a voice channel.
     * @default 50
     */
    volume: number;
}

export type GuildNotificationSettings = {
    /**
     * The text to display when a member joins the guild, or undefined if not enabled by the guild's owner.
     */
    memberAdded?: string;

    /**
     * The text to display when a member leaves the guild, or undefined if not enabled by the guild's owner.
     */
    memberRemoved?: string;

    /**
     * The text to display when a new YouTube video is found on a watched channel.
     */
    newYoutubeVideo: string;
}

export type GuildQuote = {
    memberId: string;
    message: string;
    time: number;
}

export type GuildRow = {
    id: string;
    settings?: string;
}
