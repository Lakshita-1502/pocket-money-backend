const User = require("../models/User");

// COMPLETE PROFILE
exports.completeProfile = async (req, res) => {
  try {
    const { name, dob, referralCode } = req.body;

    const user = await User.findById(req.user.id);

    user.name = name;
    user.dob = dob;
    user.referralCode = referralCode;
    user.isProfileComplete = true;

    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};