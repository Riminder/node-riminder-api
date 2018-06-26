"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var http_1 = require("../http");
var Stage = /** @class */ (function () {
    function Stage(riminder) {
        this.riminder = riminder;
    }
    Stage.prototype.set = function (data) {
        var url = defaults_1.default.API_URL + "/profile/stage";
        return http_1.httpPatchRequest(url, data, { headers: this.riminder.headers });
    };
    return Stage;
}());
exports.default = Stage;
//# sourceMappingURL=stage.js.map