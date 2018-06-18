import { generateURLParams } from "./utils";
import defaults from "./defaults";
import { httpRequest } from "./http";

export interface RiminderObjectsOptions {
  where?: any;
  page?: number;
  itemsPerPage?: number;
}

interface ProfilesOptions {
  source_ids: Array<string>;
  date_start: Date;
  date_end: Date;
  page: number;
  seniority?: string;
  filter_id?: string;
  filter_reference?: string;
  stage?: string;
  rating?: string;
  limit?: number;
  sort_by?: string;
  order_by?: string;
}

interface ProfileOptionId {
  source_id: string;
  profile_id: string;
}

interface ProfileOptionReference {
  source_id: string;
  profile_reference: string;
}

type ProfileOptionIdOrReference = ProfileOptionId | ProfileOptionReference;

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
  createResumeForProfile: (profileID: string, sourceID: string, file: File) => {

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
  updateProfileStage: (id: string, sourceID: string, jobID: string, stage: string) => {
    let url = `${defaults.API_URL}/profile/${id}/stage`;
    let body = {
      source_id: sourceID,
      job_id: jobID,
      stage: stage,
    };

    return httpRequest(url, { body });
  },
  updateProfileRating: (id: string, sourceID: string, jobID: string, rating: number) => {
    let url = `${defaults.API_URL}/profile/${id}/rating`;
    let body = {
      source_id: sourceID,
      job_id: jobID,
      rating: rating,
    };

    return httpRequest(url, { body });
  }
};
