const mongoose = require("mongoose");

<<<<<<< Updated upstream
const userSchema = new mongoose.Schema({
  firebase_uid: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
=======
const userSchema = new mongoose.Schema(
  {
    firebase_uid: {
      type: String,
      required: true,
      unique: true,
    },

    phone: String,

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: String,

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    hasPassword: {
      type: Boolean,
      default: false,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    name: String,
    dob: Date,
    referralCode: String,
>>>>>>> Stashed changes
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);