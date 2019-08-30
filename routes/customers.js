const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const _ = require("lodash");
const express = require("express");
const router = express();
const { validateCustomer, Customer } = require("../models/customer");

router.get("/", async (req, resp) => {
  const customers = await Customer.find().sort("name");
  resp.status(200).send(customers);
});

router.get("/:id", async (req, resp) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return resp
      .status(404)
      .send("The customer with the given ID was not found.");
  resp.status(200).send(customer);
});

router.post("/", auth, async (req, resp) => {
  const { error } = validateCustomer(req.body);
  if (error) return resp.status(404).send(error.details[0].message);

  const customer = new Customer(_.pick(req.body, ["name", "phone"]));

  await customer.save();
  resp.status(200).send(customer);
});

router.put("/:id", auth, async (req, resp) => {
  const { error } = validateCustomer(req.body);
  if (error) return resp.status(404).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ["name", "phone", "isGold"]),
    { new: true }
  );

  if (!customer)
    return resp.status(400).send("Some problem on the update requet");

  resp.status(200).send(customer);
});

router.delete("/:id", [auth, admin], async (req, resp) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return resp
      .status(404)
      .send("The customer with the given ID was not found.");

  resp.status(200).send(customer);
});

module.exports = router;
