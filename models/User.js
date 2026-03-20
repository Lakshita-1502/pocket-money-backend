const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  password: { type: String,}
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);