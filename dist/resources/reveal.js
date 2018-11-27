"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../defaults");
var utils_1 = require("../utils");
var http_1 = require("../http");
var Reveal = /** @class */ (function () {
    function Reveal(riminder) {
        this.riminder = riminder;
    }
    Reveal.prototype.list = function (options) {
        var urlParams = utils_1.generateURLParams(options);
        return http_1.httpRequest(defaults_1.default.API_URL + "/profile/interpretability?" + urlParams, { headers: this.riminder.headers });
    };
    return Reveal;
}());
exports.default = Reveal;
//# sourceMappingURL=reveal.js.map