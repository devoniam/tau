export abstract class Bucket {
    protected table: string = '';
    protected id: string;

    constructor(id: string) {
        this.id = id;
    }

    public save(): Promise<void> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    public load(): Promise<void> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}
