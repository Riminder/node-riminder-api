"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var utils_1 = require("../utils");
var http_1 = require("../http");
var Scoring = /** @class */ (function () {
    function Scoring(riminder) {
        this.riminder = riminder;
    }
    Scoring.prototype.list = function (options) {
        var urlParams = utils_1.generateURLParams(options);
        return http_1.httpRequest(defaults_1.default.API_URL + "/profile/scoring?" + urlParams, { headers: this.riminder.headers });
    };
    return Scoring;
}());
exports.default = Scoring;
//# sourceMappingURL=scoring.js.map