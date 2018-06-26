import { RiminderOptions } from "./types";
import { Webhooks } from "./webhooks";
import Source from "./resources/source";
import Filter from "./resources/filter";
import Profile from "./resources/profile";
declare class Riminder {
    headers: any;
    API_Key: string;
    Webhooks_Key: string;
    webhooks: Webhooks;
    source: Source;
    filter: Filter;
    profile: Profile;
    constructor(options: RiminderOptions);
    private _init;
}
export = Riminder;
