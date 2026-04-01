const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const firebaseUser = req.firebaseUser;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

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
      isPhoneVerified: true,
      isEmailVerified: false,
      hasPassword: true,
      isProfileComplete: false,
    });

    await user.save();

    const nextStep = getNextStep(user);

    res.json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        phone: user.phone,
      },
      nextStep,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ LOGIN (using phone + password)
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const nextStep = getNextStep(user);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          phone: user.phone,
        },
      },
      nextStep,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

    const nextStep = getNextStep(user);

    res.json({
      success: true,
      message: "Email verified successfully",
      data: {},
      nextStep,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//complete profile
exports.completeProfile = async (req, res) => {
  try {
    const { name, dob, referralCode } = req.body;
    const userId = req.user.id;

    if (!name || !dob) {
      return res.status(400).json({
        success: false,
        message: "Name and DOB required",
      });
    }

    const user = await User.findById(userId);

    user.name = name;
    user.dob = dob;
    user.referralCode = referralCode;
    user.isProfileComplete = true;

    await user.save();

    const nextStep = getNextStep(user);

    res.json({
      success: true,
      message: "Profile completed successfully",
      data: {},
      nextStep,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    // ✅ NULL CHECK (CORRECT PLACE)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      message: "Profile fetched successfully",
      data: {
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getNextStep = (user) => {
  if (!user.isPhoneVerified) return "PHONE_VERIFICATION";
  if (!user.hasPassword) return "SET_PASSWORD";
  if (!user.isEmailVerified) return "VERIFY_EMAIL";
  if (!user.isProfileComplete) return "COMPLETE_PROFILE";
  return "HOME";
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const firebaseUser = req.firebaseUser;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      firebase_uid: firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
