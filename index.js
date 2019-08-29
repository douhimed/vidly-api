const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

app.use(express.json());

const dbName = "vidly";

mongoose
  .connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true })
  .then(console.log(`Connected to ${dbName}`))
  .catch(err => console.log("Error : ", err.message));

const homeRouter = require("./routes/home");
app.use("/", homeRouter);

const genresRouter = require("./routes/genres");
app.use("/genres", genresRouter);

const customersRouter = require("./routes/customers");
app.use("/customers", customersRouter);

const moviesRouter = require("./routes/movies");
app.use("/movies", moviesRouter);

const rentalsRouter = require("./routes/rentals");
app.use("/rentals", rentalsRouter);

const port = process.env.port || 3000;
app.listen(port, () => console.log("is connected to the port ", port));
