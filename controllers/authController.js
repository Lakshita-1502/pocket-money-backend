const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


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
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firebase_uid: firebaseUser.uid,
      phone: firebaseUser.phone_number,
      password: hashedPassword,
    });

    await user.save();

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
};