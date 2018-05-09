import { httpRequest } from "./http";
import { create, getOne, getList } from "./utils";
import objects from "./objects";

export interface RiminderOptions {
  API_Key: string;
  API_Secret?: string;
}

export class Riminder {
  static _instance: Riminder;
  public API_Key: string;
  public objects: any;
  public webhooks: any;
  constructor(options: RiminderOptions) {
    if (Riminder._instance) {
      let error = new Error("You can not instanciate more than one instance of Riminder SDK");
      throw error;
    }

    if (!options.API_Key) {
      let error = new Error("No API Key was supplied for Riminder SDK");
      throw error;
    }

    this.API_Key = options.API_Key;
    this._init();
    Riminder._instance = this;
  }

  private _init() {
    this.objects = objects;
    this.webhooks = {};
  }

}