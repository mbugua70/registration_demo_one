const mongoose = require("mongoose");
const UserModel = require("../models/userLogin");
const jwt = require("jsonwebtoken");

// createToken method

const createToken = ({ _id }) => {
  // the first arguement is usually the payload
  // second arg is the secret string
  // third arg its an optional parameter
  return jwt.sign({ _id }, process.env.SECRET_STRING, { expiresIn: "3d" });
};

// get all users
module.exports.users_get_all = async (req, res) => {

  try {
    const UserReport = await UserModel.find({ });
    console.log(UserReport);
    if (UserReport.length === 0) {
      return res
        .status(200)
        .json({ success: true, msg: "No user is available" });
    }
    return res.status(200).json({ success: true, UserReport });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// get single user
module.exports.single_get_user = async (req, res) => {
  try {
    const paramsID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(paramsID)) {
      return res.status(404).json({ error: "No such user" });
    }
    const SingleUser = await UserModel.findById(paramsID);
    // console.log(SingleWorkOut);
    if (!SingleUser) {
      return res.status(400).json({ error: "No such user" });
    }
    res.status(200).json({ success: true, SingleUser });

  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// login user controller

module.exports.loginUser = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await UserModel.LoginUser(name, password);
    const token = createToken(user._id);
    res.status(200).json({ name, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.signUpUser = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await UserModel.SignUp(name, password);
    const token = createToken(user._id);
    res.status(201).json({ name, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// user update

module.exports.users_update = async (req, res) => {
  try {
    const paramsID = req.params.id;
    const updatedValue = req.body;
    if (!mongoose.Types.ObjectId.isValid(paramsID)) {
      return res.status(404).json({ error: "No such user" });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      paramsID,
      updatedValue,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "No such user" });
    }

    res.status(201).json({ success: true, updatedUser });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// delete user

module.exports.users_delete = async (req, res) => {
  try {
    const paramsID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(paramsID)) {
      return res.status(404).json({ error: "No such user" });
    }
    const deleteResult = await UserModel.findByIdAndDelete({
      _id: paramsID,
    });
    console.log(deleteResult);
    if (!deleteResult) {
      return res.status(404).json({ error: "No such user" });
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
