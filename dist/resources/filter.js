"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var utils_1 = require("../utils");
var http_1 = require("../http");
var Filter = /** @class */ (function () {
    function Filter(riminder) {
        this.riminder = riminder;
    }
    Filter.prototype.get = function (options) {
        var urlParams = utils_1.generateURLParams(options);
        return http_1.httpRequest(defaults_1.default.API_URL + "/filter?" + urlParams, { headers: this.riminder.headers });
    };
    Filter.prototype.list = function () {
        return http_1.httpRequest(defaults_1.default.API_URL + "/filters", { headers: this.riminder.headers });
    };
    return Filter;
}());
exports.default = Filter;
//# sourceMappingURL=filter.js.map