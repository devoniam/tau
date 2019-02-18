import { Logger } from './logger';
import { CronJob } from 'cron';

export class Job {
    private logger: Logger;
    private options: JobOptions;

    constructor(options: JobOptions) {
        this.options = options;
        this.logger = new Logger('job:' + this.options.name);
    }

    /**
     * Starts the cron job.
     */
    public start() {
        new CronJob(this.options.time, this.execute.bind(this), null, true, this.options.timezone || 'America/Phoenix');
    }

    /**
     * Executes the cron job on the configured schedule.
     */
    protected execute() {

    }

    /**
     * Returns the logger instance for this command.
     */
    protected getLogger(): Logger {
        return this.logger;
    }
}

type JobOptions = {
    /**
     * A unique name for the job.
     */
    name: string;

    /**
     * The schedule or time to run the job at. For recurring jobs, you should pass a string in the format of
     * `[sec] [min] [hour] [dom] [mon] [dow]`
     *
     * - Seconds: 0-59
     * - Minutes: 0-59
     * - Hours: 0-23
     * - Day of Month: 1-31
     * - Months: 0-11 (Jan-Dec)
     * - Day of Week: 0-6 (Sun-Sat)
     */
    time: string | Date;

    /**
     * The timezone in which to run the job. Defaults to `America/Phoenix`.
     */
    timezone?: string;
};
