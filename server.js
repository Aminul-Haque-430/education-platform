const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

/* ================================
   MongoDB Connection
================================ */
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

/* ================================
   Homepage
================================ */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

/* ================================
   Serve Converted HTML Applications
   URL: /application/filename.html
================================ */
app.get("/application/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    "html-applications",
    req.params.filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("❌ Application not found");
  }

  res.sendFile(filePath);
});

/* ================================
   Serve Applications Search Index
   URL: /applications-index
================================ */
app.get("/applications-index", (req, res) => {
  const indexPath = path.join(__dirname, "applications-index.json");

  if (!fs.existsSync(indexPath)) {
    return res.status(404).send("❌ Index file not found");
  }

  res.sendFile(indexPath);
});

/* ================================
   API: Return All Applications Data
   URL: /api/apps
================================ */
app.get("/api/apps", (req, res) => {
  const appsDir = path.join(__dirname, "applications");

  if (!fs.existsSync(appsDir)) {
    return res.status(404).json({ error: "Applications directory not found" });
  }

  const folders = fs.readdirSync(appsDir);
  const data = [];

  folders.forEach(folder => {
    const contentPath = path.join(appsDir, folder, "content.json");

    if (fs.existsSync(contentPath)) {
      try {
        const jsonData = JSON.parse(fs.readFileSync(contentPath, "utf8"));
        data.push(jsonData);
      } catch (err) {
        console.error(`❌ Invalid JSON in ${folder}/content.json`);
      }
    }
  });

  res.json(data);
});

/* ================================
   Start Server
================================ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});