import Riminder = require("..");
import { ProfileOptionIdOrReference } from "../types";
export default class Document {
    private riminder;
    constructor(riminder: Riminder);
    list(options: ProfileOptionIdOrReference): Promise<any>;
}
