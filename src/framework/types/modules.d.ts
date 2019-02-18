declare module 'cron' {
    class CronJob {
        constructor(cronTime: string | Date, onTick: Function, onComplete?: Function | null, start?: boolean | null, timeZone?: string | null);

        /**
         * Starts the job.
         */
        public start() : void;

        /**
         * Stops the job.
         */
        public stop() : void;

        /**
         * Sets the time for the cron job.
         */
        public setTime(time: CronTime) : void;
    }

    class CronTime {
        constructor(time: string | Date);
    }
}
