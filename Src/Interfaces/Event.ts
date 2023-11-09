import Muzox from "../Structures/Muzox_Client.js";

export default class Event {
    public client: Muzox;
    public one: boolean;
    public file: string;
    public name: string;
    public fileName: string;
    constructor(client: Muzox, file: string, options: EventOptions) {
        this.client = client;
        this.file = file;
        this.name = options.name;
        this.one = options.one || false;
        this.fileName = file.split('.')[0];
    }
    public async run(...args: any[]): Promise<any> {
        return Promise.resolve();
    }
};

interface EventOptions {
    name: string;
    one?: boolean;
};