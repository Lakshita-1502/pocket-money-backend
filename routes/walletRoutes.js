const express = require("express");
const router = express.Router();

const { createWallet, getWallet } = require("../controllers/walletController");
const { verifyJWT } = require("../middleware/authMiddleware");

router.post("/create", verifyJWT, createWallet);
router.get("/", verifyJWT, getWallet);

module.exports = router;