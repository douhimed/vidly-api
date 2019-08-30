const auth = require("../middlewares/auth");
const _ = require("lodash");
const express = require("express");
const router = express();
const { validateMovie, Movie } = require("../models/movie");
const { Genre } = require("../models/genre");

router.get("/", async (req, resp) => {
  const movies = await Movie.find().sort("title");
  resp.status(200).send(movies);
});

router.get("/:id", async (req, resp) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return resp.status(404).send("The movie with the given ID was not found.");
  resp.status(200).send(movie);
});

router.post("/", auth, async (req, resp) => {
  const { error } = validateMovie(req.body);
  if (error) return resp.status(404).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreID);
  if (!genre) return resp.status(404).send("The Genre was Not Found");

  const movie = new Movie(
    _.pick(req.body, ["title", "numberInStock", "dailyRentalRate"])
  );
  movie.genre = genre;

  await movie.save();
  resp.status(200).send(movie);
});

module.exports = router;
