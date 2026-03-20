const Otp = require("../models/Otp");

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.create({
    phone,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  console.log("OTP:", otp); // simulate SMS

  res.json({ message: "OTP sent successfully" });
};

const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const record = await Otp.findOne({ phone, otp });

  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone, isVerified: true });
  } else {
    user.isVerified = true;
    await user.save();
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Verification successful",
    token,
    user
  });
};

const bcrypt = require("bcryptjs");

exports.setPassword = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password set successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};