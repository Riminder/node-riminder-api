import "fetch-everywhere";
import FormData from "form-data";
import defaults from "./defaults";
import { Riminder } from "./index";
import { ProfileUpload } from "./types";
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

export const httpPostRequest = (url: string, file: ReadStream, data: ProfileUpload) => {
  const headers = {
    "X-API-Key": Riminder._instance.API_Key || defaults.API_Key,
  };

  let body = new FormData();
  body.append("file", file as any);

  Object.keys(data).forEach((key) => {
    if ((data as any)[key] instanceof Array) {
      (data as any)[key].forEach((obj: any) => {
        body.append(key, JSON.stringify(obj));
      });
    } else {
      body.append(key, (data as any)[key]);
    }
  });

  const opts = {
    headers,
    method: "POST"
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