const express = require("express");
const router = express();
const { validate, Genre } = require("../models/genre");

router.get("/", async (req, resp) => {
  const genres = await Genre.find().sort("name");
  return resp.status(200).send(genres);
});

router.get("/:id", async (req, resp) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) resp.status(400).send("Not found");
  resp.status(200).send(genre);
});

router.post("/", async (req, resp) => {
  const { error } = validate(req.body);
  if (error) return resp.status(404).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name
  });

  await genre.save();
  resp.status(200).send(genre);
});

router.put("/:id", async (req, resp) => {
  const { error } = validate(req.body);
  if (error) return resp.status(404).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre)
    return resp
      .status(400)
      .send("The genre withe the ID = " + id + " Not found");

  resp.status(200).send(genre);
});

router.delete("/:id", async (req, resp) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return resp
      .status(400)
      .send("The genre withe the ID = " + id + " Not found");

  resp
    .status(200)
    .send(genre)
    .message("this genre was deleted");
});

// local db ==> Array
/*
let genres = [
  { id: 100, name: "Horror" },
  { id: 101, name: "Action" },
  { id: 102, name: "Comedy" }
];

router.get("/", (req, resp) => {
  return resp.status(200).send(genres);
});

router.get("/:id", (req, resp) => {
  const id = parseInt(req.params.id);
  const genre = genres.find(g => g.id === id);
  if (!genre) resp.status(400).send("Not found");
  resp.status(200).send(genre);
});

router.post("/", (req, resp) => {
  const { error } = validate(req.body);
  if (error) return resp.status(404).send(error.details[0].message);

  const name = req.body.name;
  if (genres.find(g => g.name === name))
    return resp.status(404).send("The genre : " + name + " already existe");

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };

  genres.push(genre);
  resp.status(200).send(genre);
});

router.put("/:id", (req, resp) => {
  const id = parseInt(req.params.id);
  const genre = genres.find(g => g.id === id);
  if (!genre)
    return resp
      .status(400)
      .send("The genre withe the ID = " + id + " Not found");

  const { error } = validate(req.body);
  if (error) return resp.status(404).send(error.details[0].message);

  genre.name = req.body.name;
  resp.status(200).send(genre);
});

router.delete("/:id", (req, resp) => {
  const id = parseInt(req.params.id);
  const genre = genres.find(g => g.id === id);
  if (!genre)
    return resp
      .status(400)
      .send("The genre withe the ID = " + id + " Not found");

  const indexof = genres.indexOf(genre);
  genres.splice(indexof, 1);
  resp
    .status(200)
    .send(genre)
    .message("this genre was deleted");
});
*/

module.exports = router;
