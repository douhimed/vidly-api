const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function() {
  const dbName = "vidly";
  mongoose
    .connect(`mongodb://localhost:27017/${dbName}`, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(winston.info(`Connected to ${dbName}`));
};
