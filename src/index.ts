import { Objects } from "./objects";
import { RiminderOptions } from "./types";
import { Webhooks } from "./webhooks";

export class Riminder {
  public API_Key: string;
  public Webhooks_Key: string;
  public objects: Objects;
  public webhooks: Webhooks;
  constructor(options: RiminderOptions) {

    if (!options.API_Key) {
      let error = new Error("No API Key was supplied for Riminder SDK");
      throw error;
    }

    this.API_Key = options.API_Key;

    if (options.Webhooks_Key) {
      this.Webhooks_Key = options.Webhooks_Key;
    }

    this._init();
  }

  private _init() {
    this.objects = new Objects(this);
    if (this.Webhooks_Key) {
      this.webhooks = new Webhooks(this.Webhooks_Key);
    }
  }

}