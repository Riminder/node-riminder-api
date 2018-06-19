import "fetch-everywhere";
const FormData = require("form-data");
import defaults from "./defaults";
import { Riminder } from "./index";
import { ReadStream } from "fs";

declare interface RiminderAPIResponse {
  code: number;
  message: string;
  data?: any;
}

export const httpRequest = (url: string, options?: any) => {
  let headers = {
    "X-API-Key": Riminder._instance.API_Key || defaults.API_Key,
  };

  let opts = {
    headers,
    credentials: "include",
    ...options
  };

  return fetch(url, opts)
    .then(successHandler, errorHandler)
    .then((json: RiminderAPIResponse) => json.data);
};

export const httpPostRequest = (url: string, data: any, file?: ReadStream) => {
  const headers = {
    "X-API-Key": Riminder._instance.API_Key || defaults.API_Key,
  };

  const body = generateBody(data, file);

  const opts = {
    headers,
    method: "POST",
    body,
  };

  return fetch(url, opts)
    .then(successHandler, errorHandler)
    .then((json: RiminderAPIResponse) => json.data);
};

export const httpPatchRequest = (url: string, data: any) => {
  const headers = {
    "X-API-Key": Riminder._instance.API_Key || defaults.API_Key,
  };

  const body = generateBody(data);

  const opts = {
    headers,
    method: "PATCH",
    body,
  };

  return fetch(url, opts)
    .then(successHandler, errorHandler)
    .then((json: RiminderAPIResponse) => json.data);
};

const successHandler = (response: Response) => {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }
  console.error(response);
};

const errorHandler = (err: any) => {
  let error = new Error(err.message);
  (<any>error).response = err;
  throw error;
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
