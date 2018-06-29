"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("fetch-everywhere");
var FormData = require("form-data");
var errors_1 = require("./errors");
exports.httpRequest = function (url, options) {
    var opts = __assign({ credentials: "include" }, options);
    return fetch(url, opts)
        .then(successHandler, errorHandler)
        .then(function (json) { return json.data; });
};
exports.httpPostRequest = function (url, data, file, options) {
    var body = generateBody(data, file);
    var opts = __assign({}, options, { method: "POST", body: body });
    return fetch(url, opts)
        .then(successHandler, errorHandler)
        .then(function (json) { return json.data; });
};
exports.httpPatchRequest = function (url, data, options) {
    Object.assign(options.headers, { "Content-type": "application/json" });
    var body = JSON.stringify(data);
    var opts = __assign({}, options, { method: "PATCH", body: body });
    return fetch(url, opts)
        .then(successHandler, errorHandler)
        .then(function (json) { return json.data; });
};
var successHandler = function (response) {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    }
    return response.json().then(function (data) {
        throw new errors_1.APIError("An error occured", data);
    });
};
var errorHandler = function (err) {
    var error = new Error(err.message);
    error.response = err;
    return Promise.reject(error);
};
var generateBody = function (data, file) {
    var body = new FormData();
    if (file) {
        body.append("file", file);
    }
    Object.keys(data).forEach(function (key) {
        if (data[key] instanceof Array) {
            body.append(key, JSON.stringify(data[key]));
        }
        else {
            body.append(key, data[key]);
        }
    });
    return body;
};
//# sourceMappingURL=http.js.map