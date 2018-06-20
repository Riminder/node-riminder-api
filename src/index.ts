import { Objects } from "./objects";

export interface RiminderOptions {
  API_Key: string;
  API_Secret?: string;
}

export class Riminder {
  public API_Key: string;
  public objects: any;
  public webhooks: any;
  constructor(options: RiminderOptions) {

    if (!options.API_Key) {
      let error = new Error("No API Key was supplied for Riminder SDK");
      throw error;
    }

    this.API_Key = options.API_Key;
    this._init();
  }

  private _init() {
    this.objects = new Objects(this);
    this.webhooks = {};
  }

}