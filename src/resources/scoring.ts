import Riminder = require("..");
import defaults from "../defaults";
import { generateURLParams } from "../utils";
import { ProfileOptionIdOrReference } from "../types";
import { httpRequest } from "../http";

export default class Scoring {
  private riminder: Riminder;
  constructor(riminder: Riminder) {
    this.riminder = riminder;
  }

  list(options: ProfileOptionIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile/scoring?${urlParams}`, { headers: this.riminder.headers });
  }
}