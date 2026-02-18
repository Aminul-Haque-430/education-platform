const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API route to send content.json
app.get("/api/content", (req, res) => {
  const filePath = path.join(__dirname, "content.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Failed to load content" });
    }
    res.json(JSON.parse(data));
  });
});

// Optional: Delete content (for demo purpose, does not write to file)
app.delete("/api/content/:title", (req, res) => {
  res.json({ message: `Deleted: ${req.params.title}` });
});

// Optional: Edit content (for demo purpose, does not write to file)
app.put("/api/content/:title", (req, res) => {
  res.json({ message: `Edited: ${req.params.title}`, newContent: req.body });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
