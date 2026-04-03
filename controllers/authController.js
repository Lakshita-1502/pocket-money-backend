const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

<<<<<<< Updated upstream

// ✅ REGISTER (after Firebase OTP verification)
exports.register = async (req, res) => {
  try {
    const { password } = req.body;
    const firebaseUser = req.firebaseUser;

    const existingUser = await User.findOne({
      firebase_uid: firebaseUser.uid,
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
=======
// PHONE LOGIN / REGISTER
exports.phoneLogin = async (req, res) => {
  try {
    const firebaseUser = req.firebaseUser;

    let user = await User.findOne({
      firebase_uid: firebaseUser.uid,
    });

    if (!user) {
      user = await User.create({
        firebase_uid: firebaseUser.uid,
        phone: firebaseUser.phone_number,
        isPhoneVerified: true,
      });
>>>>>>> Stashed changes
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

<<<<<<< Updated upstream
    const user = new User({
      firebase_uid: firebaseUser.uid,
      phone: firebaseUser.phone_number,
      password: hashedPassword,
=======
    res.json({
      success: true,
      data: { token },
      nextStep: getNextStep(user),
>>>>>>> Stashed changes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD EMAIL
exports.addEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const user = await User.findById(req.user.id);
    user.email = email;

    await user.save();

<<<<<<< Updated upstream
    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ LOGIN (using phone + password)
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
=======
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const firebaseUser = req.firebaseUser;

    const user = await User.findOne({
      firebase_uid: firebaseUser.uid,
    });

    user.isEmailVerified = true;
    await user.save();

    res.json({
      success: true,
      nextStep: getNextStep(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SET PASSWORD
exports.setPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.id);

    user.password = await bcrypt.hash(password, 10);
    user.hasPassword = true;

    await user.save();

    res.json({
      success: true,
      nextStep: getNextStep(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      data: { token },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;

    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      message: "Proceed with Firebase OTP",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const firebaseUser = req.firebaseUser;

    const user = await User.findOne({
      firebase_uid: firebaseUser.uid,
    });

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// NEXT STEP LOGIC
const getNextStep = (user) => {
  if (!user.email) return "ADD_EMAIL";
  if (!user.isEmailVerified) return "VERIFY_EMAIL";
  if (!user.hasPassword) return "SET_PASSWORD";
  if (!user.isProfileComplete) return "COMPLETE_PROFILE";
  return "HOME";
>>>>>>> Stashed changes
};