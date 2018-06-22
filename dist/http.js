import "fetch-everywhere";
const FormData = require("form-data");
import { APIError } from "./errors";
export const httpRequest = (url, options) => {
    let opts = Object.assign({ credentials: "include" }, options);
    return fetch(url, opts)
        .then(successHandler, errorHandler)
        .then((json) => json.data);
};
export const httpPostRequest = (url, data, file, options) => {
    const body = generateBody(data, file);
    const opts = Object.assign({}, options, { method: "POST", body });
    return fetch(url, opts)
        .then(successHandler, errorHandler)
        .then((json) => json.data);
};
export const httpPatchRequest = (url, data, options) => {
    Object.assign(options.headers, { "Content-type": "application/json" });
    const body = JSON.stringify(data);
    const opts = Object.assign({}, options, { method: "PATCH", body });
    return fetch(url, opts)
        .then(successHandler, errorHandler)
        .then((json) => json.data);
};
const successHandler = (response) => {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    }
    return response.json().then((data) => {
        throw new APIError("An error occured", data);
    });
};
const errorHandler = (err) => {
    let error = new Error(err.message);
    error.response = err;
    return Promise.reject(error);
};
const generateBody = (data, file) => {
    const body = new FormData();
    if (file) {
        body.append("file", file);
    }
    Object.keys(data).forEach((key) => {
        if (data[key] instanceof Array) {
            data[key].forEach((obj) => {
                body.append(key, JSON.stringify(obj));
            });
        }
        else {
            body.append(key, data[key]);
        }
    });
    return body;
};
//# sourceMappingURL=http.js.map