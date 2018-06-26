import { RiminderOptions } from "./types";
import { Webhooks } from "./webhooks";
import Source from "./resources/source";
import Filter from "./resources/filter";
import Profile from "./resources/profile";

class Riminder {
  public headers: any;
  public API_Key: string;
  public Webhooks_Key: string;
  public webhooks: Webhooks;
  public source: Source;
  public filter: Filter;
  public profile: Profile;

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

    this.source = new Source(this);
    this.filter = new Filter(this);
    this.profile = new Profile(this);
  }
}

export = Riminder;