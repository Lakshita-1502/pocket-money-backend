const Wallet = require("../models/Wallet");
const User = require("../models/User");

exports.createWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // ✅ Check KYC
    if (!user.isKycVerified) {
      return res.status(400).json({
        message: "Complete KYC before creating wallet",
      });
    }

    // ✅ Prevent duplicate wallet
    const existingWallet = await Wallet.findOne({ user: user._id });

    if (existingWallet) {
      return res.json({
        success: true,
        wallet: existingWallet,
      });
    }

    // ✅ Create wallet
    const wallet = await Wallet.create({
      user: user._id,
      balance: 0,
      totalCredited: 0,
      totalDebited: 0,
      remainingBalance: 0,
    });

    res.json({
      success: true,
      wallet,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json({
      success: true,
      wallet,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};