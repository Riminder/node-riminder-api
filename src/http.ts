import "fetch-everywhere";
const FormData = require("form-data");
import defaults from "./defaults";
import { Riminder } from "./index";
import { ReadStream } from "fs";
import { RiminderAPIResponse } from "./types";
import { APIError } from "./errors";

export const httpRequest = (url: string, options?: any) => {
  let opts = {
    credentials: "include",
    ...options
  };

  return fetch(url, opts)
    .then(successHandler, errorHandler)
    .then((json: RiminderAPIResponse) => json.data);
};

export const httpPostRequest = (url: string, data: any, file?: ReadStream, options?: any) => {
  const body = generateBody(data, file);

  const opts = {
    ...options,
    method: "POST",
    body,
  };

  return fetch(url, opts)
    .then(successHandler, errorHandler)
    .then((json: RiminderAPIResponse) => json.data);
};

export const httpPatchRequest = (url: string, data: any, options?: any) => {
  Object.assign(options.headers, { "Content-type": "application/json" });
  const body = JSON.stringify(data);

  const opts = {
    ...options,
    method: "PATCH",
    body
  };

  return fetch(url, opts)
    .then(successHandler, errorHandler)
    .then((json: RiminderAPIResponse) => json.data);
};

const successHandler = (response: Response) => {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }
  return response.json().then((data: RiminderAPIResponse) => {
    throw new APIError("An error occured", data);
  });
};

const errorHandler = (err: any) => {
  let error = new Error(err.message);
  (<any>error).response = err;
  return Promise.reject(error);
};

const generateBody = (data: any, file?: ReadStream) => {
  const body = new FormData();

  if (file) {
    body.append("file", file as any);
  }

  Object.keys(data).forEach((key) => {
    if ((data as any)[key] instanceof Array) {
      (data as any)[key].forEach((obj: any) => {
        body.append(key, JSON.stringify(obj));
      });
    } else {
      body.append(key, (data as any)[key]);
    }
  });

  return body;
};
