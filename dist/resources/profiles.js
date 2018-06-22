"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var utils_1 = require("../utils");
var http_1 = require("../http");
var Profiles = /** @class */ (function () {
    function Profiles(riminder) {
        this.riminder = riminder;
    }
    Profiles.prototype.getOne = function (options) {
        var urlParams = utils_1.generateURLParams(options);
        return http_1.httpRequest(defaults_1.default.API_URL + "/profile?" + urlParams, { headers: this.riminder.headers });
    };
    Profiles.prototype.getList = function (options) {
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
        var urlParams = utils_1.generateURLParams(options);
        return http_1.httpRequest(defaults_1.default.API_URL + "/profiles?" + urlParams, { headers: this.riminder.headers });
    };
    Profiles.prototype.create = function (data, file) {
        if (data.timestamp_reception && typeof data.timestamp_reception === "object") {
            data.timestamp_reception = Math.floor(data.timestamp_reception.getTime() / 1000);
        }
        else {
            data.timestamp_reception = Math.floor(data.timestamp_reception / 1000);
        }
        if (data.training_metadata) {
            data.training_metadata.forEach(function (metadata) {
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
        var url = defaults_1.default.API_URL + "/profile";
        return http_1.httpPostRequest(url, data, file, { headers: this.riminder.headers });
    };
    return Profiles;
}());
exports.default = Profiles;
//# sourceMappingURL=profiles.js.map