const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Defining out Schema structure.

const dealersSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the name"],
    },
    email: {
      type: String,
      required: [true, "Please enter the email"],
    },
    company: {
      type: String,
      required: [true, "Please enter the company"],
    },
    terms: {
      type: String,
    },
    confirmed: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const dealersModel = mongoose.model("Dealer", dealersSchema);
module.exports = dealersModel;
