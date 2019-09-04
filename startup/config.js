const config = require("config");

module.exports = function() {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR : my jwtPrivateKey is not defined");
  }
};
