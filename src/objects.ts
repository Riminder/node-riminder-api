import { create, getOne, getList, generateURLParams } from "./utils";
import defaults from "./defaults";
import { httpRequest } from "./http";

export interface RiminderObjectsOptions {
  where?: any;
  page?: number;
  itemsPerPage?: number;
}

export default {
  getSources: (options?: RiminderObjectsOptions) => {
    return getList("sources", options);
  },
  getSource: (id: string) => {
    return getOne("source", id);
  },
  getProfiles: (options?: RiminderObjectsOptions) => {
    return getList("profiles", options);
  },
  getProfile: (id: string, sourceID: string) => {
    let url = `${defaults.API_URL}/profile/${id}?source_id=${sourceID}`;
    return httpRequest(url);
  },
  createResumeForProfile: (profileID: string, sourceID: string, file: File) => {

  },
  getProfileDocuments: (id: string, sourceID: string) => {
    let url = `${defaults.API_URL}/profile/${id}/documents?source_id=${sourceID}`;
    return httpRequest(url);
  },
  getProfileExtractions: (id: string, sourceID: string) => {
    let url = `${defaults.API_URL}/profile/${id}/extractions?source_id=${sourceID}`;
    return httpRequest(url);
  },
  getProfileJobs: (id: string, sourceID: string) => {
    let url = `${defaults.API_URL}/profile/${id}/jobs?source_id=${sourceID}`;
    return httpRequest(url);
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
