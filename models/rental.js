const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        trim: true
      },
      dailyRentalRate: { type: Number, required: true, min: 0, default: 0 }
    }),
    required: true
  },
  customer: {
    type: new mongoose.Schema({
      name: { type: String, minlength: 5, maxlength: 100, required: true },
      isGold: { type: Boolean, default: false },
      phone: { type: String, required: true }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: { type: Date },
  rentalFree: { type: Number, min: 0 }
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(body) {
  const schema = {
    movieID: Joi.objectId().required(),
    customerID: Joi.objectId().required()
  };
  return Joi.validate(body, schema);
}

exports.Rental = Rental;
exports.validateRental = validateRental;
