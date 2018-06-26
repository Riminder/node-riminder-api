import Riminder = require("..");
import defaults from "../defaults";
import { httpPatchRequest } from "../http";
import { RatingPatch } from "../types";

export default class Rating {
  private riminder: Riminder;

  constructor(riminder: Riminder) {
    this.riminder = riminder;
  }

  set(data: RatingPatch) {
    let url = `${defaults.API_URL}/profile/rating`;
    return httpPatchRequest(url, data, { headers: this.riminder.headers });
  }
}