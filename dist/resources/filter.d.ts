import Riminder = require("..");
import { FilterIdOrReference } from "../types";
export default class Filter {
    private riminder;
    constructor(riminder: Riminder);
    get(options: FilterIdOrReference): Promise<any>;
    list(): Promise<any>;
}
