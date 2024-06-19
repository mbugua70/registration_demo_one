const mongoose = require("mongoose");
const GeneralReportsSchemaModel = require("../models/reportmodel");
// controllers functions

// Players all
module.exports.general_report_get_all = async (req, res) => {
  //   res.json({ msg: "Get all the workouts" });
  const query = req.query.q;
  try {
    const generalReport = await GeneralReportsSchemaModel.find({
      $or: [
        { player_email: { $regex: query, $options: "i" } },
        { player_marchandize: { $regex: query, $options: "i" } },
      ],
    });
    console.log(generalReport);
    if (generalReport.length === 0) {
      return res
        .status(200)
        .json({ success: true, msg: "You have no workout record available" });
    }
    return res.status(200).json({ success: true, generalReport });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// Players all
module.exports.players_report_get_all = async (req, res) => {
  //   res.json({ msg: "Get all the workouts" });
  const query = req.query.q;
  const numberQuery = parseFloat(query);

  try {
    const generalReport = await GeneralReportsSchemaModel.find({
      $or: [
        { player_email: { $regex: query, $options: "i" } },
        { player_phone: isNaN(numberQuery) ? undefined : numberQuery },
      ],
    });
    if (generalReport.length === 0) {
      return res
        .status(200)
        .json({ success: true, msg: "You have no workout record available" });
    }
    return res.status(200).json({ success: true, generalReport });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};
