const express = require("express");
const router = express.Router();

const {
  phoneLogin,
  addEmail,
  verifyEmail,
  setPassword,
  login,
<<<<<<< Updated upstream
} = require("../controllers/authController");

const verifyFirebaseToken = require("../middleware/authMiddleware");

// 🔐 Register (requires Firebase token)
router.post("/register", verifyFirebaseToken, register);

// 🔐 Login (password based)
router.post("/login", login);

=======
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  verifyFirebaseToken,
  verifyJWT,
} = require("../middleware/authMiddleware");

router.post("/phone-login", verifyFirebaseToken, phoneLogin);

router.post("/add-email", verifyJWT, addEmail);
router.post("/verify-email", verifyFirebaseToken, verifyEmail);

router.post("/set-password", verifyJWT, setPassword);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyFirebaseToken, resetPassword);

>>>>>>> Stashed changes
module.exports = router;