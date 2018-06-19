import { parse } from "url";
import { handleRequest } from "./mockedResponse";

const fetch = (url, opts) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = parse(url);
    return resolve(handleRequest(parsedUrl, opts, opts.error ? 400 : 200));
  });
};

global.fetch = fetch;