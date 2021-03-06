import Riminder = require("..");
import defaults from "../defaults";
import { httpRequest } from "../http";

export default class Source {
  private riminder: Riminder;
  constructor(riminder: Riminder) {
    this.riminder = riminder;
  }

  get(id: string) {
    return httpRequest(`${defaults.API_URL}/source?source_id=${id}`, { headers: this.riminder.headers });
  }

  list() {
    return httpRequest(`${defaults.API_URL}/sources`, { headers: this.riminder.headers });
  }
}