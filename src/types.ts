export interface ProfilesOptions {
  source_ids: Array<string>;
  date_start: Date | number;
  date_end: Date | number;
  page?: number;
  seniority?: Seniority;
  filter_id?: string;
  filter_reference?: string;
  stage?: Stage;
  rating?: number;
  limit?: number;
  sort_by: SortBy;
  order_by?: OrderBy;
}

export interface RiminderOptions {
  API_Key: string;
  Webhooks_Key?: string;
}

export interface RiminderAPIResponse {
  code: number;
  message: string;
  data?: any;
}

export interface ProfileOptionId {
  source_id: string;
  profile_id: string;
}

export interface ProfileOptionReference {
  source_id: string;
  profile_reference: string;
}

export type ProfileOptionIdOrReference = ProfileOptionId | ProfileOptionReference;

export interface TrainingMetadata {
  filter_reference: string;
  stage: Stage;
  stage_timestamp: Date | number;
  rating: number;
  rating_timestamp: Date | number;
}

export interface ProfileUpload {
  source_id: string;
  profile_reference: string;
  timestamp_reception: Date | number;
  training_metadata?: Array<TrainingMetadata>;
}

export interface StagePatchBase {
  source_id: string;
  stage: Stage | null;
}

export interface StagePatchProfileIdFilterId extends StagePatchBase {
  profile_id: string;
  filter_id: string;
}

export interface StagePatchProfileIdFilterReference extends StagePatchBase {
  profile_id: string;
  filter_reference: string;
}

export interface StagePatchProfileReferenceFilterId extends StagePatchBase {
  profile_reference: string;
  filter_id: string;
}

export interface StagePatchProfileReferenceFilterReference extends StagePatchBase {
  profile_reference: string;
  filter_reference: string;
}

export type StagePatch =
  StagePatchProfileIdFilterId |
  StagePatchProfileIdFilterReference |
  StagePatchProfileReferenceFilterId |
  StagePatchProfileReferenceFilterReference;

export interface RatingPatchBase {
  source_id: string;
  rating: number | null;
}

export interface RatingPatchProfileIdFilterId extends RatingPatchBase {
  profile_id: string;
  filter_id: string;
}

export interface RatingPatchProfileIdFilterReference extends RatingPatchBase {
  profile_id: string;
  filter_reference: string;
}

export interface RatingPatchProfileReferenceFilterId extends RatingPatchBase {
  profile_reference: string;
  filter_id: string;
}

export interface RatingPatchProfileReferenceFilterReference extends RatingPatchBase {
  profile_reference: string;
  filter_reference: string;
}

export type RatingPatch =
  RatingPatchProfileIdFilterId |
  RatingPatchProfileIdFilterReference |
  RatingPatchProfileReferenceFilterId |
  RatingPatchProfileReferenceFilterReference;

export interface FilterId {
  filter_id: string;
}

export interface FilterReference {
  filter_reference: string;
}

export type FilterIdOrReference = FilterId | FilterReference;

export interface Experience {
  start: string;
  end: string;
  title: string;
  company: string;
  location_details: {
    text: string;
  };
  location: string;
  description: string;
}

export interface Education {
  start: string;
  end: string;
  title: string;
  school: string;
  location_details: {
    text: string;
  };
  location: string;
  description: string;
}

export interface ProfileJSON {
  name: string;
  email: string;
  phone: string;
  summary: string;
  timestamp_reception: Date | number;
  location_details: {
    text: string;
  };
  experiences: Array<Experience>;
  educations: Array<Education>;
  skills: Array<string>;
  languages: Array<string>;
  interests: Array<string>;
  urls: {
    from_resume: Array<string>;
    linkedin: string;
    twitter: string;
    facebook: string;
    github: string;
    picture: string;
  };
}

export interface JsonUploadCheck {
  profile_json: ProfileJSON;
  training_metadata?: Array<TrainingMetadata>;
}

export interface JsonUpload {
  source_id: string;
  profile_json: ProfileJSON;
  profile_reference?: string;
  training_metadata?: Array<TrainingMetadata>;
}

export enum Stage {
  NEW = "NEW",
  YES = "YES",
  LATER = "LATER",
  NO = "NO",
}

export enum SortBy {
  RECEPTION = "reception",
  RANKING = "ranking"
}

export enum OrderBy {
  DESC = "desc",
  ASC = "asc"
}

export enum Seniority {
  ALL = "all",
  SENIOR = "senior",
  JUNIOR = "junior"
}

export interface WebhooksResponse {
  team_name: string;
  webhook_id: string;
  webhook_url: string;
}
