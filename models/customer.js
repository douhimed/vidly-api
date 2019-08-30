const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, minlength: 5, maxlength: 100, required: true },
  isGold: { type: Boolean, default: false },
  phone: { type: String, required: true }
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(body) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(100),
    phone: Joi.string().required(),
    isGold: Joi.boolean()
  };
  return Joi.validate(body, schema);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
