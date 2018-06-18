const handleRequest = (url, options) => {
  const response = {
    status: 200,
    data: {
      url,
      options,
    },
    json: function() { return this; }
  }
  return Promise.resolve(response);
}

module.exports = {
  handleRequest,
};
