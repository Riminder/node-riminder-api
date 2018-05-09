import "whatwg-fetch";
import "./defaults";
import defaults from "./defaults";
import { Riminder } from "./index";

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