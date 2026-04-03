const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));

app.listen(8000, () => console.log("Server running on port 8000"));