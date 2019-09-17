const express = require("express");
const error = require("../middlewares/error");
const homeRouter = require("../routes/home");
const genresRouter = require("../routes/genres");
const customersRouter = require("../routes/customers");
const moviesRouter = require("../routes/movies");
const rentalsRouter = require("../routes/rentals");
const usersRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const returns = require("../routes/returns");

module.exports = function(app) {
  app.use(express.json());
  app.use("/", homeRouter);
  app.use("/genres", genresRouter);
  app.use("/customers", customersRouter);
  app.use("/movies", moviesRouter);
  app.use("/rentals", rentalsRouter);
  app.use("/users", usersRouter);
  app.use("/login", authRouter);
  app.use("/returns", returns);
  app.use(error);
};
