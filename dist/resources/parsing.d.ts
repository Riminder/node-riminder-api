import Riminder = require("..");
import { ProfileOptionIdOrReference } from "../types";
export default class Parsing {
    private riminder;
    constructor(riminder: Riminder);
    get(options: ProfileOptionIdOrReference): Promise<any>;
}
