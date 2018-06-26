"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var utils_1 = require("../utils");
var http_1 = require("../http");
var Filters = /** @class */ (function () {
    function Filters(riminder) {
        this.riminder = riminder;
    }
    Filters.prototype.getOne = function (options) {
        var urlParams = utils_1.generateURLParams(options);
        return http_1.httpRequest(defaults_1.default.API_URL + "/filter?" + urlParams, { headers: this.riminder.headers });
    };
    Filters.prototype.getList = function () {
        return http_1.httpRequest(defaults_1.default.API_URL + "/filters", { headers: this.riminder.headers });
    };
    return Filters;
}());
exports.default = Filters;
//# sourceMappingURL=filters.js.map