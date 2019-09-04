require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function() {
  const dbName = "vidly";

  winston.handleExceptions(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", ex => {
    throw ex;
  });

  winston.add(winston.transports.File, { filename: "logFile.log" });

  winston.add(winston.transports.MongoDB, {
    db: `mongodb://localhost:27017/${dbName}`,
    level: "info"
  });
};
