"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var http_1 = require("../http");
var ProfileStage = /** @class */ (function () {
    function ProfileStage(riminder) {
        this.riminder = riminder;
    }
    ProfileStage.prototype.update = function (data) {
        var url = defaults_1.default.API_URL + "/profile/stage";
        return http_1.httpPatchRequest(url, data, { headers: this.riminder.headers });
    };
    return ProfileStage;
}());
exports.default = ProfileStage;
//# sourceMappingURL=profileStage.js.map