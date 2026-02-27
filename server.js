// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Cross-Origin Resource Sharing
require('dotenv').config();   // For local development, optional on Render

const app = express();

// Enable CORS for all origins (or customize for specific domains)
app.use(cors());

// Environment variables
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in environment variables");
  process.exit(1); // Stop server if URI missing
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
});

// Homepage route
app.get("/", (req, res) => {
    res.send("Hello Amin! Your education platform is live and ready to explore");
});

// Optional: test route for API
app.get("/test", (req, res) => {
    res.json({ message: "Test route works!" });
});