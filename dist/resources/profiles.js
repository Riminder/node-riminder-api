import defaults from "../defaults";
import { generateURLParams } from "../utils";
import { httpPostRequest, httpRequest } from "../http";
export default class Profiles {
    constructor(riminder) {
        this.riminder = riminder;
    }
    getOne(options) {
        const urlParams = generateURLParams(options);
        return httpRequest(`${defaults.API_URL}/profile?${urlParams}`, { headers: this.riminder.headers });
    }
    getList(options) {
        if (options.date_end && typeof options.date_end === "object") {
            options.date_end = Math.floor(options.date_end.getTime() / 1000);
        }
        else {
            options.date_end = Math.floor(options.date_end / 1000);
        }
        if (options.date_start && typeof options.date_start === "object") {
            options.date_start = Math.floor(options.date_start.getTime() / 1000);
        }
        else {
            options.date_start = Math.floor(options.date_start / 1000);
        }
        const urlParams = generateURLParams(options);
        return httpRequest(`${defaults.API_URL}/profiles?${urlParams}`, { headers: this.riminder.headers });
    }
    create(data, file) {
        if (data.timestamp_reception && typeof data.timestamp_reception === "object") {
            data.timestamp_reception = Math.floor(data.timestamp_reception.getTime() / 1000);
        }
        else {
            data.timestamp_reception = Math.floor(data.timestamp_reception / 1000);
        }
        if (data.training_metadata) {
            data.training_metadata.forEach((metadata) => {
                if (typeof metadata.rating_timestamp === "object") {
                    metadata.rating_timestamp = Math.floor(metadata.rating_timestamp.getTime() / 1000);
                }
                else {
                    metadata.rating_timestamp = Math.floor(metadata.rating_timestamp / 1000);
                }
                if (typeof metadata.stage_timestamp === "object") {
                    metadata.stage_timestamp = Math.floor(metadata.stage_timestamp.getTime() / 1000);
                }
                else {
                    metadata.stage_timestamp = Math.floor(metadata.stage_timestamp / 1000);
                }
            });
        }
        const url = `${defaults.API_URL}/profile`;
        return httpPostRequest(url, data, file, { headers: this.riminder.headers });
    }
}
//# sourceMappingURL=profiles.js.map