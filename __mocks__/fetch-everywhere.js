import { parse } from "url";
import { handleRequest } from "./mockedResponse";

const fetch = (url, opts) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = parse(url);
    if (opts.reject) {
      return reject({message: "Error message"});
    }
    return resolve(handleRequest(parsedUrl, opts, opts.error ? 400 : 200));
  });
};

global.fetch = fetch;