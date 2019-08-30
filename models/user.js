const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true
  },
  isAdmin: { type: Boolean, default: false }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(body) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
      .max(255),
    email: Joi.string()
      .required()
      .min(5)
      .max(255)
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    isAdmin: Joi.boolean()
  };
  return Joi.validate(body, schema);
}

exports.User = User;
exports.validate = validateUser;
