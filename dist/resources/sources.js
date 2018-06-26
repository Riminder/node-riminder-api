"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var http_1 = require("../http");
var Sources = /** @class */ (function () {
    function Sources(riminder) {
        this.riminder = riminder;
    }
    Sources.prototype.getOne = function (id) {
        return http_1.httpRequest(defaults_1.default.API_URL + "/source?source_id=" + id, { headers: this.riminder.headers });
    };
    Sources.prototype.getList = function () {
        return http_1.httpRequest(defaults_1.default.API_URL + "/sources", { headers: this.riminder.headers });
    };
    return Sources;
}());
exports.default = Sources;
//# sourceMappingURL=sources.js.map