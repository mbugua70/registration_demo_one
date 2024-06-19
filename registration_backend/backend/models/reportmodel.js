const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Defining out Schema structure.

const GeneralreportsSchema = new Schema(
  {
    player_email: {
      type: String,
    },
    player_phone: {
      type: Number,
    },
    player_marchandize: {
      type: String,
    },
  },
  { timestamps: true }
);

const GeneralReportsSchemaModel = mongoose.model(
  "player",
  GeneralreportsSchema
);
module.exports = GeneralReportsSchemaModel;
