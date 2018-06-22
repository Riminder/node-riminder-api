import Riminder = require("..");
import defaults from "../defaults";
import { FilterIdOrReference } from "../types";
import { generateURLParams } from "../utils";
import { httpRequest } from "../http";

export default class Filters {
  private riminder: Riminder;

  constructor(riminder: Riminder) {
    this.riminder = riminder;
  }

  getOne(options: FilterIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/filter?${urlParams}`, { headers: this.riminder.headers });
  }

  getList() {
    return httpRequest(`${defaults.API_URL}/filters`, { headers: this.riminder.headers });
  }
}