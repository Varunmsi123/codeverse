const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const freindsRoutes = require("./routes/freindsRoutes");
const challengeRoutes = require("./routes/challengeRoutes");

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
}));


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Database Error:", err));

app.use("/auth", authRoutes); 
app.use("/users",userRoutes);
app.use("/friends",freindsRoutes);
app.use("/challenge",challengeRoutes);