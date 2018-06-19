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

interface ProfileOptionId {
  source_id: string;
  profile_id: string;
}

interface ProfileOptionReference {
  source_id: string;
  profile_reference: string;
}

export type ProfileOptionIdOrReference = ProfileOptionId | ProfileOptionReference;

interface TrainingMetadataId {
  filter_id: string;
  stage: string;
  stage_timestamp: Date;
  rating: number;
  rating_timestamp: Date;
}

interface TrainingMetadataReference {
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

interface StagePatchProfileIdFilterId {
  source_id: string;
  profile_id: string;
  filter_id: string;
  stage: string | null;
}

interface StagePatchProfileIdFilterReference {
  source_id: string;
  profile_id: string;
  filter_reference: string;
  stage: string | null;
}

interface StagePatchProfileReferenceFilterId {
  source_id: string;
  profile_reference: string;
  filter_id: string;
  stage: string | null;
}

interface StagePatchProfileReferenceFilterReference {
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