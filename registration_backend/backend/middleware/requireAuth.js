const jwt = require("jsonwebtoken");
const UserModal = require("../models/userLogin");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET_STRING);
    req.user = await UserModal.findOne({ _id }).select("_id");
    next();
  } catch (err) {
    res.status(401).json({ err: "Request is not authorized" });
  }
};

module.exports = requireAuth;
