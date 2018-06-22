import Riminder = require("..");
import { FilterIdOrReference } from "../types";
export default class Filters {
    private riminder;
    constructor(riminder: Riminder);
    getOne(options: FilterIdOrReference): Promise<any>;
    getList(): Promise<any>;
}
