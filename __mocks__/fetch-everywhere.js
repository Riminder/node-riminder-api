const { parse } = require('url');
const { handleRequest } = require('./mockedResponse');

const fetch = (url, opts) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = parse(url);
    return resolve(handleRequest(parsedUrl, opts));
  });
};

global.fetch = fetch;