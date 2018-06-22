"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var utils_1 = require("../utils");
var http_1 = require("../http");
var ProfileParsing = /** @class */ (function () {
    function ProfileParsing(riminder) {
        this.riminder = riminder;
    }
    ProfileParsing.prototype.get = function (options) {
        var urlParams = utils_1.generateURLParams(options);
        return http_1.httpRequest(defaults_1.default.API_URL + "/profile/parsing?" + urlParams, { headers: this.riminder.headers });
    };
    return ProfileParsing;
}());
exports.default = ProfileParsing;
//# sourceMappingURL=profileParsing.js.map