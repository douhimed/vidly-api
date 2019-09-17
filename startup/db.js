const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function() {
  const dbName = "vidly";
  mongoose
    .connect(config.get("db"), {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(winston.info(`Connected to ${dbName}`));
};
