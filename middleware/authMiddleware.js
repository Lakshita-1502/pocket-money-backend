const admin = require("../config/firebase");

<<<<<<< Updated upstream
const verifyFirebaseToken = async (req, res, next) => {
=======
// Firebase Token
exports.verifyFirebaseToken = async (req, res, next) => {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
module.exports = verifyFirebaseToken;
=======
// JWT Token
exports.verifyJWT = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
>>>>>>> Stashed changes
