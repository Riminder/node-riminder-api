import {
  ProfilesOptions,
  ProfileOptionIdOrReference,
  ProfileUpload,
  StagePatch,
  RatingPatch,
  FilterIdOrReference
  } from "./types";
import { generateURLParams } from "./utils";
import defaults from "./defaults";
import { httpRequest, httpPostRequest, httpPatchRequest } from "./http";
import { ReadStream } from "fs";
import { Riminder } from "./index";

export class Objects {
  private headers: any;

  constructor(riminder: Riminder) {
    this.headers = {
      "X-API-Key": riminder.API_Key,
    };
  }

  getSources() {
    return httpRequest(`${defaults.API_URL}/sources`, { headers: this.headers });
  }

  getSource(id: string) {
    return httpRequest(`${defaults.API_URL}/source?source_id=${id}`, { headers: this.headers });
  }

  getProfiles(options: ProfilesOptions) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profiles?${urlParams}`, { headers: this.headers });
  }

  getProfile(options: ProfileOptionIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile?${urlParams}`, { headers: this.headers });
  }

  getFilters() {
    return httpRequest(`${defaults.API_URL}/filters`, { headers: this.headers });
  }

  getFilter(options: FilterIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/filter?${urlParams}`, { headers: this.headers });
  }

  createResumeForProfile(data: ProfileUpload, file: ReadStream) {
    const url = `${defaults.API_URL}/profile`;
    return httpPostRequest(url, data, file, { headers: this.headers });
  }

  getProfileDocuments(options: ProfileOptionIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile/documents?${urlParams}`, { headers: this.headers });
  }

  getProfileParsing(options: ProfileOptionIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile/parsing?${urlParams}`, { headers: this.headers });
  }

  getProfileScoring(options: ProfileOptionIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile/scoring?${urlParams}`, { headers: this.headers });
  }

  updateProfileStage(data: StagePatch) {
    let url = `${defaults.API_URL}/profile/stage`;
    return httpPatchRequest(url, data, { headers: this.headers });
  }

  updateProfileRating(data: RatingPatch) {
    let url = `${defaults.API_URL}/profile/rating`;
    return httpPatchRequest(url, data, { headers: this.headers });
  }
}
