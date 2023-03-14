require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "shh";
const jwt = require("jsonwebtoken");

function generateToken(payload, time) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: time });
}

module.exports = {
  generateToken,
};
