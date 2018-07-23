"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var http_1 = require("../http");
var JSON = /** @class */ (function () {
    function JSON(riminder) {
        this.riminder = riminder;
    }
    JSON.prototype.add = function (data) {
        var transformedData = this._tranformTimestamp(data);
        var url = defaults_1.default.API_URL + "/profile/json";
        return http_1.httpPostRequest(url, transformedData, null, { headers: this.riminder.headers });
    };
    JSON.prototype.check = function (data) {
        var transformedData = this._tranformTimestamp(data);
        var url = defaults_1.default.API_URL + "/profile/json/check";
        return http_1.httpPostRequest(url, transformedData, null, { headers: this.riminder.headers });
    };
    JSON.prototype._tranformTimestamp = function (data) {
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
        return data;
    };
    return JSON;
}());
exports.default = JSON;
//# sourceMappingURL=json.js.map