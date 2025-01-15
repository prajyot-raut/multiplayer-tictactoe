const crypto = require("crypto");

function generateRandomId() {
  return crypto.randomBytes(9).toString("hex");
}

module.exports = generateRandomId;
