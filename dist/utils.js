"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateURLParams = function (options) {
    return options ? Object.keys(options).map(function (key) {
        if (options[key] instanceof Array) {
            return key + "=[" + options[key].map(function (elem) { return "\"" + elem + "\""; }).join(",") + "]";
        }
        return key + "=" + options[key];
    }).join("&") : null;
};
//# sourceMappingURL=utils.js.map