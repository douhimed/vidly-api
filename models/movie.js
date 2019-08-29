const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0
  },
  dailyRentalRate: { type: Number, required: true, min: 0, default: 0 }
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(body) {
  const schema = {
    title: Joi.string()
      .min(2)
      .max(255)
      .required(),
    genreID: Joi.objectId().required(),
    numberInStock: Joi.number()
      .required()
      .min(0),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
  };

  return Joi.validate(body, schema);
}

exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.validateMovie = validateMovie;
