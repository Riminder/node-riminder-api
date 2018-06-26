"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var utils_1 = require("../utils");
var http_1 = require("../http");
var ProfileScoring = /** @class */ (function () {
    function ProfileScoring(riminder) {
        this.riminder = riminder;
    }
    ProfileScoring.prototype.get = function (options) {
        var urlParams = utils_1.generateURLParams(options);
        return http_1.httpRequest(defaults_1.default.API_URL + "/profile/scoring?" + urlParams, { headers: this.riminder.headers });
    };
    return ProfileScoring;
}());
exports.default = ProfileScoring;
//# sourceMappingURL=profileScoring.js.map