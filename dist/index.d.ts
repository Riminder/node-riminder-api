import { RiminderOptions } from "./types";
import { Webhooks } from "./webhooks";
import Sources from "./resources/sources";
import Filters from "./resources/filters";
import Profiles from "./resources/profiles";
import ProfileDocuments from "./resources/profileDocuments";
import ProfileParsing from "./resources/profileParsing";
import ProfileScoring from "./resources/profileScoring";
import ProfileRating from "./resources/profileRating";
import ProfileStage from "./resources/profileStage";
declare class Riminder {
    headers: any;
    API_Key: string;
    Webhooks_Key: string;
    webhooks: Webhooks;
    sources: Sources;
    filters: Filters;
    profiles: Profiles;
    profileDocuments: ProfileDocuments;
    profileParsing: ProfileParsing;
    profileScoring: ProfileScoring;
    profileRating: ProfileRating;
    profileStage: ProfileStage;
    constructor(options: RiminderOptions);
    private _init;
}
export = Riminder;
