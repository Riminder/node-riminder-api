"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var utils_1 = require("../utils");
var http_1 = require("../http");
var ProfileDocuments = /** @class */ (function () {
    function ProfileDocuments(riminder) {
        this.riminder = riminder;
    }
    ProfileDocuments.prototype.get = function (options) {
        var urlParams = utils_1.generateURLParams(options);
        return http_1.httpRequest(defaults_1.default.API_URL + "/profile/documents?" + urlParams, { headers: this.riminder.headers });
    };
    return ProfileDocuments;
}());
exports.default = ProfileDocuments;
//# sourceMappingURL=profileDocuments.js.map