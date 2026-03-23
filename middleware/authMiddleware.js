const admin = require("../config/firebase");

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Firebase token" });
  }
};

module.exports = verifyFirebaseToken;