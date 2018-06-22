import {
  ProfilesOptions,
  ProfileOptionIdOrReference,
  ProfileUpload,
  StagePatch,
  RatingPatch,
  FilterIdOrReference,
  TrainingMetadata
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

  getFilters() {
    return httpRequest(`${defaults.API_URL}/filters`, { headers: this.headers });
  }

  getFilter(options: FilterIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/filter?${urlParams}`, { headers: this.headers });
  }

  getProfiles(options: ProfilesOptions) {
    if (options.date_end && typeof options.date_end === "object") {
      options.date_end = Math.floor(options.date_end.getTime() / 1000);
    } else {
      options.date_end = Math.floor(options.date_end as number / 1000);
    }
    if (options.date_start && typeof options.date_start === "object") {
      options.date_start = Math.floor(options.date_start.getTime() / 1000);
    } else {
      options.date_start = Math.floor(options.date_start as number / 1000);
    }
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profiles?${urlParams}`, { headers: this.headers });
  }

  getProfile(options: ProfileOptionIdOrReference) {
    const urlParams = generateURLParams(options);
    return httpRequest(`${defaults.API_URL}/profile?${urlParams}`, { headers: this.headers });
  }

  postProfile(data: ProfileUpload, file: ReadStream) {
    if (data.timestamp_reception && typeof data.timestamp_reception === "object") {
      data.timestamp_reception = Math.floor(data.timestamp_reception.getTime() / 1000);
    } else {
      data.timestamp_reception = Math.floor(data.timestamp_reception as number / 1000);
    }
    if (data.training_metadata) {
      data.training_metadata.forEach((metadata: TrainingMetadata) => {
        if (typeof metadata.rating_timestamp === "object") {
          metadata.rating_timestamp = Math.floor(metadata.rating_timestamp.getTime() / 1000);
        } else {
          metadata.rating_timestamp = Math.floor(metadata.rating_timestamp as number / 1000);
        }
        if (typeof metadata.stage_timestamp === "object") {
          metadata.stage_timestamp = Math.floor(metadata.stage_timestamp.getTime() / 1000);
        } else {
          metadata.stage_timestamp = Math.floor(metadata.stage_timestamp as number / 1000);
        }
      });
    }
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

  patchProfileStage(data: StagePatch) {
    let url = `${defaults.API_URL}/profile/stage`;
    return httpPatchRequest(url, data, { headers: this.headers });
  }

  patchProfileRating(data: RatingPatch) {
    let url = `${defaults.API_URL}/profile/rating`;
    return httpPatchRequest(url, data, { headers: this.headers });
  }
}
