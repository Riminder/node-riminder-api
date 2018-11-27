import Riminder = require("..");
import { ProfileOptionIdOrReference } from "../types";
export default class Reveal {
    private riminder;
    constructor(riminder: Riminder);
    list(options: ProfileOptionIdOrReference): Promise<any>;
}
