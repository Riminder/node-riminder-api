import { httpRequest } from "./http";
import defaults from "./defaults";

export const create = (object: string, data: any) => {
  let url = `${defaults.API_URL}/${object}`;
  let body = JSON.stringify(data);
  let options = {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return httpRequest(url, options);
};

export const generateURLParams = (options: any) => {
  return options ? Object.keys(options).map(key => {
    if (options[key] instanceof Array) {
      return `${key}=[${options[key]}]`;
    }
    return `${key}=${options[key]}`;
  }).join("&") : null;
};