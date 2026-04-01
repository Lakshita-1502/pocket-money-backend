const express = require("express");
const router = express.Router();

const {
  register,
  login,
  emailVerified,
  completeProfile,
  getProfile,
} = require("../controllers/authController");

// ✅ Correct import (ONLY ONCE)
const { verifyFirebaseToken, verifyJWT } = require("../middleware/authMiddleware");

// 🔐 Register (Firebase)
router.post("/register", verifyFirebaseToken, register);

// 🔐 Login
router.post("/login", login);

// 🔐 Email verification
router.post("/email-verified", verifyFirebaseToken, emailVerified);

// 🔐 Complete profile
router.post("/complete-profile", verifyJWT, completeProfile);

// 🔐 Get profile
router.get("/profile", verifyJWT, getProfile);

const { resetPassword } = require("../controllers/authController");
router.post("/reset-password", verifyFirebaseToken, resetPassword);

module.exports = router;