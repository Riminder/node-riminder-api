import Riminder from "..";
export default class Sources {
    private riminder;
    constructor(riminder: Riminder);
    getOne(id: string): Promise<any>;
    getList(): Promise<any>;
}
