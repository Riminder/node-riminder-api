export interface ProfilesOptions {
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

export interface ProfileOptionId {
  source_id: string;
  profile_id: string;
}

export interface ProfileOptionReference {
  source_id: string;
  profile_reference: string;
}

export type ProfileOptionIdOrReference = ProfileOptionId | ProfileOptionReference;

export interface TrainingMetadataId {
  filter_id: string;
  stage: string;
  stage_timestamp: Date;
  rating: number;
  rating_timestamp: Date;
}

export interface TrainingMetadataReference {
  filter_reference: string;
  stage: string;
  stage_timestamp: Date;
  rating: number;
  rating_timestamp: Date;
}

export interface ProfileUpload {
  source_id: string;
  profile_reference: string;
  timestamp_reception: Date;
  training_metadata: Array<TrainingMetadataId | TrainingMetadataReference>;
}

export interface StagePatchProfileIdFilterId {
  source_id: string;
  profile_id: string;
  filter_id: string;
  stage: string | null;
}

export interface StagePatchProfileIdFilterReference {
  source_id: string;
  profile_id: string;
  filter_reference: string;
  stage: string | null;
}

export interface StagePatchProfileReferenceFilterId {
  source_id: string;
  profile_reference: string;
  filter_id: string;
  stage: string | null;
}

export interface StagePatchProfileReferenceFilterReference {
  source_id: string;
  profile_reference: string;
  filter_reference: string;
  stage: string | null;
}

export type StagePatch =
  StagePatchProfileIdFilterId |
  StagePatchProfileIdFilterReference |
  StagePatchProfileReferenceFilterId |
  StagePatchProfileReferenceFilterReference;

export interface RatingPatchProfileIdFilterId {
  source_id: string;
  profile_id: string;
  filter_id: string;
  rating: string | null;
}

export interface RatingPatchProfileIdFilterReference {
  source_id: string;
  profile_id: string;
  filter_reference: string;
  rating: string | null;
}

export interface RatingPatchProfileReferenceFilterId {
  source_id: string;
  profile_reference: string;
  filter_id: string;
  rating: string | null;
}

export interface RatingPatchProfileReferenceFilterReference {
  source_id: string;
  profile_reference: string;
  filter_reference: string;
  rating: string | null;
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