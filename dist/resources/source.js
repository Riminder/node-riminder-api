"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var http_1 = require("../http");
var Source = /** @class */ (function () {
    function Source(riminder) {
        this.riminder = riminder;
    }
    Source.prototype.get = function (id) {
        return http_1.httpRequest(defaults_1.default.API_URL + "/source?source_id=" + id, { headers: this.riminder.headers });
    };
    Source.prototype.list = function () {
        return http_1.httpRequest(defaults_1.default.API_URL + "/sources", { headers: this.riminder.headers });
    };
    return Source;
}());
exports.default = Source;
//# sourceMappingURL=source.js.map