const express = require("express");
const router = express.Router();

const {
  completeProfile,
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const { verifyJWT } = require("../middleware/authMiddleware");

router.post("/complete-profile", verifyJWT, completeProfile);
router.get("/profile", verifyJWT, getProfile);
router.put("/profile", verifyJWT, updateProfile);

module.exports = router;