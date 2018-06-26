import Riminder = require("..");
export default class Source {
    private riminder;
    constructor(riminder: Riminder);
    get(id: string): Promise<any>;
    list(): Promise<any>;
}
