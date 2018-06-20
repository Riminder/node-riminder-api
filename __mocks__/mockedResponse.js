export const handleRequest = (url, options, code) => {
  const response = {
    status: code,
    data: {
      url,
      options,
    },
    json: function() { return Promise.resolve(this); }
  }
  return Promise.resolve(response);
}
