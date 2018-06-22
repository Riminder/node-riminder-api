"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var http_1 = require("../http");
var ProfileRating = /** @class */ (function () {
    function ProfileRating(riminder) {
        this.riminder = riminder;
    }
    ProfileRating.prototype.update = function (data) {
        var url = defaults_1.default.API_URL + "/profile/rating";
        return http_1.httpPatchRequest(url, data, { headers: this.riminder.headers });
    };
    return ProfileRating;
}());
exports.default = ProfileRating;
//# sourceMappingURL=profileRating.js.map