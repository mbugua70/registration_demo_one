const mongoose = require("mongoose");
const dealersModel = require("../models/dealears");


// controllers functions

// workOut all
module.exports.dealers_search_all = async (req, res) => {

  const { query } = req.query;
  try {
    const resultDealers = await dealersModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } }
    ]
    });

    console.log(resultDealers)

    // if (searchedResulted.length === 0) {
    //   return res
    //     .status(200)
    //     .json({ success: true, msg: "No dealer was found"});
    // }

    return res.status(200).json({ success: true,  resultDealers});
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};
