const auth = require("../middlewares/auth");
const _ = require("lodash");
const express = require("express");
const mongoose = require("mongoose");
const router = express();
const { validateRental, Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const Fawn = require("fawn");

Fawn.init(mongoose);

router.get("/", async (req, resp) => {
  const rentals = await Rental.find().sort("-dateOut");
  resp.status(200).send(rentals);
});

router.get("/:id", async (req, resp) => {
  const rental = await Rental.findById(req.params.id).sort("-dateOut");
  if (!rental)
    return resp.status(404).send("The rental with the given ID was not found");
  resp.status(200).send(rental);
});

router.post("/", auth, async (req, resp) => {
  const { error } = validateRental(req.body);
  if (error) return resp.status(404).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieID);
  if (!movie)
    return resp.status(404).send("The movie with the given id was not found");

  if (movie.numberinStock <= 0)
    return resp.status(400).send("The stock is empty");

  const customer = await Customer.findById(req.body.customerID);
  if (!customer)
    return resp
      .status(404)
      .send("The customer with the given id was not found");

  const rental = new Rental({
    movie: _.pick(movie, ["_id", "title", "dailyRentalRate"]),
    customer: _.pick(customer, ["_id", "name", "phone", "isGold"])
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    resp.status(200).send(rental);
  } catch (ex) {
    resp.send(500).send("pronleme in server");
  }
});

module.exports = router;
