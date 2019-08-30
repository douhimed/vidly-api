const express = require("express");
const router = express();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, resp) => {
  const { error } = validate(req.body);
  if (error) return resp.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return resp.status(400).send("Invalid email or password");

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return resp.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  resp.send(token);
});

function validate(body) {
  const schema = {
    email: Joi.string()
      .required()
      .min(5)
      .max(255)
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(body, schema);
}

module.exports = router;
