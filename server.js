require('dotenv').config(); // Load .env at the very top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Environment Variables ---
const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;

// --- Safety check ---
if (!dbURI) {
    console.error("❌ Error: MONGO_URI is not defined in your .env file.");
    process.exit(1);
}

// --- MongoDB Connection ---
mongoose.connect(dbURI)
    .then(() => {
        console.log("✅ MongoDB connected successfully!");

        // Start server only after DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err.message);
    });

// --- Sample Route ---
app.get('/', (req, res) => {
    res.send('Education Platform Backend is running');
});