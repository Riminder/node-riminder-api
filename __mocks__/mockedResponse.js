export const handleRequest = (url, options, code) => {
  const response = {
    status: code,
    data: {
      url,
      options,
    },
    json: function() { return this; }
  }
  return Promise.resolve(response);
}
