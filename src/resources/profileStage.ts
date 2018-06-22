import Riminder from "..";
import defaults from "../defaults";
import { httpPatchRequest } from "../http";
import { StagePatch } from "../types";

export default class ProfileStage {
  private riminder: Riminder;
  constructor(riminder: Riminder) {
    this.riminder = riminder;
  }

  update(data: StagePatch) {
    let url = `${defaults.API_URL}/profile/stage`;
    return httpPatchRequest(url, data, { headers: this.riminder.headers });
  }
}