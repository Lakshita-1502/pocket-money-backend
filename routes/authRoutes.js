const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

const verifyFirebaseToken = require("../middleware/authMiddleware");

// 🔐 Register (requires Firebase token)
router.post("/register", verifyFirebaseToken, register);

// 🔐 Login (password based)
router.post("/login", login);

module.exports = router;