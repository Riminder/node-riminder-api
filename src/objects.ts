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
  apiKey: string;
  constructor(riminder: Riminder) {
    this.apiKey = riminder.API_Key;
  }

  getSources() {
    return httpRequest(`${defaults.API_URL}/sources`, this.apiKey);
  }

  getSource(id: string) {
    return httpRequest(`${defaults.API_URL}/source?source_id=${id}`, this.apiKey);
  }

  getProfiles(options: ProfilesOptions) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profiles?${urlParams}`, this.apiKey);
  }

  getProfile(options: ProfileOptionIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile?${urlParams}`, this.apiKey);
  }

  getFilters() {
    return httpRequest(`${defaults.API_URL}/filters`, this.apiKey);
  }

  getFilter(options: FilterIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/filter?${urlParams}`, this.apiKey);
  }

  createResumeForProfile(data: ProfileUpload, file: ReadStream) {
    const url = `${defaults.API_URL}/profile`;
    return httpPostRequest(url, this.apiKey, data, file);
  }

  getProfileDocuments(options: ProfileOptionIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile/documents?${urlParams}`, this.apiKey);
  }

  getProfileParsing(options: ProfileOptionIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile/parsing?${urlParams}`, this.apiKey);
  }

  getProfileScoring(options: ProfileOptionIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile/scoring?${urlParams}`, this.apiKey);
  }

  updateProfileStage(data: StagePatch) {
    let url = `${defaults.API_URL}/profile/stage`;
    return httpPatchRequest(url, this.apiKey, data);
  }

  updateProfileRating(data: RatingPatch) {
    let url = `${defaults.API_URL}/profile/rating`;
    return httpPatchRequest(url, this.apiKey, data);
  }
}
