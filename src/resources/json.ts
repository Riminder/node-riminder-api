import Riminder = require("..");
import defaults from "../defaults";
import { JsonUpload, TrainingMetadata, JsonUploadCheck } from "../types";
import { httpPostRequest } from "../http";

export default class JSON {
  private riminder: Riminder;

  constructor(riminder: Riminder) {
    this.riminder = riminder;
  }

  add(data: JsonUpload) {
    const transformedData = this._tranformTimestamp(data);
    const url = `${defaults.API_URL}/profile/json`;
    return httpPostRequest(url, transformedData, null, { headers: this.riminder.headers });
  }

  check(data: JsonUploadCheck) {
    const transformedData = this._tranformTimestamp(data);
    const url = `${defaults.API_URL}/profile/json/check`;
    return httpPostRequest(url, transformedData, null, { headers: this.riminder.headers });
  }

  private _tranformTimestamp(data: JsonUpload | JsonUploadCheck): JsonUpload | JsonUploadCheck {
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

    return data;
  }
}