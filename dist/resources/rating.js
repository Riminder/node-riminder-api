"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var http_1 = require("../http");
var Rating = /** @class */ (function () {
    function Rating(riminder) {
        this.riminder = riminder;
    }
    Rating.prototype.set = function (data) {
        var url = defaults_1.default.API_URL + "/profile/rating";
        return http_1.httpPatchRequest(url, data, { headers: this.riminder.headers });
    };
    return Rating;
}());
exports.default = Rating;
//# sourceMappingURL=rating.js.map