const mongoose = require("mongoose");
const dealersModel = require("../models/dealears");


// controllers functions

// workOut all
module.exports.dealers_search_all = async (req, res) => {
  const { query } = req.query;
  try {
    const resultDealers = await dealersModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
      ],
    });

    return res.status(200).json({ success: true, resultDealers });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// update single dealer
module.exports.dealer_update = async (req, res) => {
  try {
    const paramsID = req.params.id;
    const updatedValue = req.body;
    if (!mongoose.Types.ObjectId.isValid(paramsID)) {
      return res.status(404).json({ error: "No such dealer" });
    }
    const updatedDealer = await dealersModel.findByIdAndUpdate(
      paramsID,
      updatedValue,
      { new: true }
    );

    if (!updatedDealer) {
      return res.status(404).json({ error: "No such dealer" });
    }

    res.status(200).json({ success: true, updatedDealer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};