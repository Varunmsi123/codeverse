const express = require("express");
const mongoose = require("mongoose");
const http = require("http");          
require("dotenv").config();
const cors = require("cors");
const setupYjsServer = require("./yjsServer"); 

const app = express();
app.use(express.json());

// ← add this
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const freindsRoutes = require("./routes/freindsRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const roomRoutes = require("./routes/roomRoutes");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/friends", freindsRoutes);
app.use("/challenge", challengeRoutes);
app.use("/room", roomRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const server = http.createServer(app);  
    setupYjsServer(server);                 

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Database Error:", err));