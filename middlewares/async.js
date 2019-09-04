module.exports = function(handler) {
  return async (req, resp, next) => {
    try {
      handler(req, resp);
    } catch (ex) {
      next(ex);
    }
  };
};
