import Riminder from "..";
import defaults from "../defaults";
import { httpRequest } from "../http";

export default class Sources {
  private riminder: Riminder;
  constructor(riminder: Riminder) {
    this.riminder = riminder;
  }

  getOne(id: string) {
    return httpRequest(`${defaults.API_URL}/source?source_id=${id}`, { headers: this.riminder.headers });
  }

  getList() {
    return httpRequest(`${defaults.API_URL}/sources`, { headers: this.riminder.headers });
  }
}