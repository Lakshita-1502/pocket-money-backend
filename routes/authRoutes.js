const express = require("express");
const router = express.Router();

const {
  phoneLogin,
  addEmail,
  verifyEmail,
  setPassword,
  login,
  forgotPassword,
  resetPassword,
  register, // included from upstream
} = require("../controllers/authController");

const {
  verifyFirebaseToken,
  verifyJWT,
} = require("../middleware/authMiddleware");

// 🔐 Register (requires Firebase token)
router.post("/register", verifyFirebaseToken, register);

// 📱 Phone login (Firebase)
router.post("/phone-login", verifyFirebaseToken, phoneLogin);

// 📧 Add email (JWT required)
router.post("/add-email", verifyJWT, addEmail);

// 📧 Verify email (Firebase)
router.post("/verify-email", verifyFirebaseToken, verifyEmail);

// 🔑 Set password (JWT required)
router.post("/set-password", verifyJWT, setPassword);

// 🔐 Login (password based)
router.post("/login", login);

// 🔁 Forgot & Reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyFirebaseToken, resetPassword);

module.exports = router;