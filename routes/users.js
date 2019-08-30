const _ = require("lodash");
const express = require("express");
const router = express();
const { validate, User } = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/:id", async (req, resp) => {
  let user = await User.findById(req.params.id);
  if (!user) return resp.status(404).send("Invalide in the given id");
  resp.status(200).send(user);
});

router.post("/register", async (req, resp) => {
  const { error } = validate(req.body);
  if (error) return resp.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return resp.status(400).send("The email already registred");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  resp
    .header("x-auth-token", token)
    .send(_.pick(user, ["name", "email", "_id"]));
});

module.exports = router;
