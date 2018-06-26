"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var utils_1 = require("../utils");
var http_1 = require("../http");
var Parsing = /** @class */ (function () {
    function Parsing(riminder) {
        this.riminder = riminder;
    }
    Parsing.prototype.get = function (options) {
        var urlParams = utils_1.generateURLParams(options);
        return http_1.httpRequest(defaults_1.default.API_URL + "/profile/parsing?" + urlParams, { headers: this.riminder.headers });
    };
    return Parsing;
}());
exports.default = Parsing;
//# sourceMappingURL=parsing.js.map