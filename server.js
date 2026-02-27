// server.js
require("dotenv").config(); // Load .env at the top
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static HTML applications
app.use("/applications", express.static(path.join(__dirname, "applications")));

// Welcome route
app.get("/", (req, res) => {
  res.send("Hello Amin! Your education platform is live and ready to explore");
});

// Applications index route
app.get("/applications-index", (req, res) => {
  const indexPath = path.join(__dirname, "applications-index.json");
  if (!fs.existsSync(indexPath)) {
    return res.status(404).json({ error: "Applications index not found" });
  }

  const indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  res.json(indexData);
});

// Optional MongoDB connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));
} else {
  console.warn("⚠️ MONGO_URI not defined in .env — skipping MongoDB connection");
}

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));