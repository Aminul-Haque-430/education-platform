// server.js
// ===============================
// Education Platform – Stable Version
// Express + MongoDB (STANDARD URI)
// ===============================

// 1️⃣ Load environment variables (local only)
require("dotenv").config();

// 2️⃣ Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 3️⃣ Create app
const app = express();

// 4️⃣ Middleware
app.use(cors());
app.use(express.json());

// 5️⃣ Environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined");
  process.exit(1);
}

// 6️⃣ Connect to MongoDB (STANDARD connection)
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 15000, // prevents hanging
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // 7️⃣ Start server ONLY after DB connects
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed");
    console.error(err.message);
    process.exit(1);
  });

// 8️⃣ Routes

app.get("/", (req, res) => {
  res.send("Hello Amin! Your education platform is live and ready to explore");
});

app.get("/applications", (req, res) => {
  res.send("Applications will be listed here");
});

app.get("/letters", (req, res) => {
  res.send("Letters will be listed here");
});

app.get("/stories", (req, res) => {
  res.send("Stories will be listed here");
});

// 9️⃣ 404 handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});