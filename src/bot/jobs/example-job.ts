import { Job } from "@api";

export class ExampleJob extends Job
{
    constructor() {
        super({
            name: 'example',
            time: '0 * * * * *'
        });
    }

    execute() {
        // The `time` above runs at the 0th second every minute of every hour and every day.
        // This method gets called each tick.
    }
}
