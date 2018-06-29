export interface ProfilesOptions {
    source_ids: Array<string>;
    date_start: Date | number;
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
export declare type ProfileOptionIdOrReference = ProfileOptionId | ProfileOptionReference;
export interface TrainingMetadataBase {
    stage: Stage;
    stage_timestamp: Date | number;
    rating: number;
    rating_timestamp: Date | number;
}
export interface TrainingMetadataId extends TrainingMetadataBase {
    filter_id: string;
}
export interface TrainingMetadataReference extends TrainingMetadataBase {
    filter_reference: string;
}
export declare type TrainingMetadata = TrainingMetadataId | TrainingMetadataReference;
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
export declare type StagePatch = StagePatchProfileIdFilterId | StagePatchProfileIdFilterReference | StagePatchProfileReferenceFilterId | StagePatchProfileReferenceFilterReference;
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
export declare type RatingPatch = RatingPatchProfileIdFilterId | RatingPatchProfileIdFilterReference | RatingPatchProfileReferenceFilterId | RatingPatchProfileReferenceFilterReference;
export interface FilterId {
    filter_id: string;
}
export interface FilterReference {
    filter_reference: string;
}
export declare type FilterIdOrReference = FilterId | FilterReference;
export declare enum Stage {
    NEW = "NEW",
    YES = "YES",
    LATER = "LATER",
    NO = "NO"
}
export declare enum SortBy {
    RECEPTION = "reception",
    RANKING = "ranking"
}
export declare enum OrderBy {
    DESC = "desc",
    ASC = "asc"
}
export declare enum Seniority {
    ALL = "all",
    SENIOR = "senior",
    JUNIOR = "junior"
}