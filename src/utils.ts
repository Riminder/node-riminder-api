import { httpRequest } from "./http";
import defaults from "./defaults";

export const generateURLParams = (options: any) => {
  return options ? Object.keys(options).map(key => {
    if (options[key] instanceof Array) {
      return `${key}=[${options[key]}]`;
    }
    return `${key}=${options[key]}`;
  }).join("&") : null;
};