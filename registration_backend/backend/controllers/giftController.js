const mongoose = require("mongoose");
const GiftReportsSchemaModel = require("../models/marchandizeModel");


// post marchandize

module.exports.gifts_post = async (req, res) => {

  const {text, fillStyle, textFillStyle, strokeStyle, gift_number } = req.body;

  let emptyFields = [];

  if (!text) {
    emptyFields.push("text");
  }

  if (!fillStyle) {
    emptyFields.push("fillStyle");
  }

  if (!textFillStyle) {
    emptyFields.push("textFillStyle");
  }

  if(!strokeStyle){
    emptyFields.push("strokeStlye");
  }

  if(!gift_number){
    emptyFields.push("gift_number");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    const createGiftOut = await GiftReportsSchemaModel.create({
      text, fillStyle, textFillStyle, strokeStyle, gift_number
    });
    res.status(201).json({ success: true, createGiftOut });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// get all gift

module.exports.gifts_report_get_all = async (req, res) => {
  //   res.json({ msg: "Get all the workouts" });
  try {
    const giftReport = await GiftReportsSchemaModel.find(
      {},
      {
        text: 1,
        gift_number: 1,
        fillStyle: 1,
        textFillStyle: 1,
        strokeStyle: 1,
      }
    );
    console.log(giftReport);
    if (giftReport.length === 0) {
      return res
        .status(200)
        .json({ success: true, msg: "You have no workout record available" });
    }
    return res.status(200).json({ success: true, giftReport });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// single fetch gift

module.exports.single_get_gift = async (req, res) => {
  try {
    const paramsID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(paramsID)) {
      return res.status(404).json({ error: "No such gift" });
    }
    const SingleGift = await GiftReportsSchemaModel.findById(paramsID);
    // console.log(SingleWorkOut);
    if (!SingleGift) {
      return res.status(400).json({ error: "No such gift" });
    }
    res.status(200).json({ success: true, SingleGift });
    // if(SingleWorkOut)
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// gift update

module.exports.gift_update = async (req, res) => {
  //   res.json({ msg: "Update workout" });

  try {
    const paramsID = req.params.id;
    const updatedValue = req.body;
    if (!mongoose.Types.ObjectId.isValid(paramsID)) {
      return res.status(404).json({ error: "No such gift" });
    }
    const updatedGift = await GiftReportsSchemaModel.findByIdAndUpdate(
      paramsID,
      updatedValue,
      { new: true }
    );

    if (!updatedGift) {
      return res.status(404).json({ error: "No such workgift" });
    }

    res.status(201).json({ success: true, updatedGift });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// delete marchandize

module.exports.gift_delete = async (req, res) => {
  try {
    const paramsID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(paramsID)) {
      return res.status(404).json({ error: "No such marchandize" });
    }
    const deleteResult = await GiftReportsSchemaModel.findByIdAndDelete({
      _id: paramsID,
    });
    console.log(deleteResult);
    if (!deleteResult) {
      return res.status(404).json({ error: "No such marchandize" });
    }
    res.status(200).json({
      success: true,
      deleteResult,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};
