const winston = require("winston");

module.exports = function(err, req, resp, next) {
  winston.error(err.message, err);

  resp.status(500).send("FATAL ERROR : Something Failed");
};
