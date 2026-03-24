const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const firebaseUser = req.firebaseUser;

    const existingUser = await User.findOne({
      firebase_uid: firebaseUser.uid,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firebase_uid: firebaseUser.uid,
      phone: firebaseUser.phone_number,
      email,
      password: hashedPassword,

      // ✅ FLAGS
      isPhoneVerified: true,
      isEmailVerified: false,
      hasPassword: true,
      isProfileComplete: false,
    });

    await user.save();

    res.json({
      success: true,
      message: "User registered successfully",
      isPhoneVerified: true,
      isEmailVerified: false,
      hasPassword: true,
    });

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
};

//email verified
exports.emailVerified = async (req, res) => {
  try {
    const firebaseUser = req.firebaseUser;

    if (!firebaseUser.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Email not verified",
      });
    }

    const user = await User.findOne({
      firebase_uid: firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.email = firebaseUser.email;
    user.isEmailVerified = true;

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeProfile = async (req, res) => {
  try {
    const { name, dob, referralCode } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    user.name = name;
    user.dob = dob;
    user.referralCode = referralCode;
    user.isProfileComplete = true;

    await user.save();

    res.json({
      success: true,
      message: "Profile completed successfully",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    res.json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        dob: user.dob,
        referralCode: user.referralCode,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};