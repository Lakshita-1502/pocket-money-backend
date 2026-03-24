const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebase_uid: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  // ✅ FLAGS
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

  // ✅ PROFILE
  name: String,
  dob: Date,
  referralCode: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);