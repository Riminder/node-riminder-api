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

export default class Riminder {
  public headers: any;
  public API_Key: string;
  public Webhooks_Key: string;
  public webhooks: Webhooks;
  public sources: Sources;
  public filters: Filters;
  public profiles: Profiles;
  public profileDocuments: ProfileDocuments;
  public profileParsing: ProfileParsing;
  public profileScoring: ProfileScoring;
  public profileRating: ProfileRating;
  public profileStage: ProfileStage;

  constructor(options: RiminderOptions) {

    if (!options.API_Key) {
      let error = new Error("No API Key was supplied for Riminder SDK");
      throw error;
    }

    this.API_Key = options.API_Key;
    this.headers = {
      "X-API-Key": this.API_Key
    };

    if (options.Webhooks_Key) {
      this.Webhooks_Key = options.Webhooks_Key;
    }

    this._init();
  }

  private _init() {
    if (this.Webhooks_Key) {
      this.webhooks = new Webhooks(this.Webhooks_Key);
    }

    this.sources = new Sources(this);
    this.filters = new Filters(this);
    this.profiles = new Profiles(this);
    this.profileDocuments = new ProfileDocuments(this);
    this.profileParsing = new ProfileParsing(this);
    this.profileScoring = new ProfileScoring(this);
    this.profileRating = new ProfileRating(this);
    this.profileStage = new ProfileStage(this);
  }
}