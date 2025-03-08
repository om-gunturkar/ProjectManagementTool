const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;