const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
      unique: true,
      sparse: true, // allows null values
    },

    password: {
      type: String,
    },

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

    name: {
      type: String,
    },

    dob: {
      type: Date,
    },

    referralCode: {
      type: String,
    },
  },
  { timestamps: true } // replaces createdAt
);

module.exports = mongoose.model("User", userSchema);