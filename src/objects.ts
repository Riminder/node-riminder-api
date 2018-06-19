import {
  ProfilesOptions,
  ProfileOptionIdOrReference,
  ProfileUpload,
  StagePatch
  } from "./types";
import { generateURLParams } from "./utils";
import defaults from "./defaults";
import { httpRequest, httpPostRequest, httpPatchRequest } from "./http";
import { ReadStream } from "fs";

export default {
  getSources: () => {
    return httpRequest(`${defaults.API_URL}/sources`);
  },
  getSource: (id: string) => {
    return httpRequest(`${defaults.API_URL}/source?source_id=${id}`);
  },
  getProfiles: (options: ProfilesOptions) => {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profiles?${urlParams}`);
  },
  getProfile: (options: ProfileOptionIdOrReference) => {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile?${urlParams}`);
  },
  createResumeForProfile: (data: ProfileUpload, file: ReadStream) => {
    const url = `${defaults.API_URL}/profile`;
    return httpPostRequest(url, data, file);
  },
  getProfileDocuments: (options: ProfileOptionIdOrReference) => {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile/documents?${urlParams}`);
  },
  getProfileParsing: (options: ProfileOptionIdOrReference) => {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile/parsing?${urlParams}`);
  },
  getProfileScoring: (options: ProfileOptionIdOrReference) => {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile/scoring?${urlParams}`);
  },
  updateProfileStage: (data: StagePatch) => {
    let url = `${defaults.API_URL}/profile/stage`;
    return httpPatchRequest(url, data);
  },
  updateProfileRating: (id: string, sourceID: string, jobID: string, rating: number) => {
    let url = `${defaults.API_URL}/profile/rating`;
    let body = {
      source_id: sourceID,
      job_id: jobID,
      rating: rating,
    };

    return httpRequest(url, { body });
  }
};
