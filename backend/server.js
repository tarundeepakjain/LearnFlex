const path = require('path');
const fetch = require('node-fetch');
// Load env variables
require('dotenv').config();

// External Modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
// App Initialization
const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = process.env.MONGO_URI;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// ✅ LeetCode Proxy Route (Axios-based)
app.post("/api/leetcode", async (req, res) => {
  try {
    const { query } = req.body;
    console.log("📥 Received query:", query);

    const response = await axios.post(
      "https://leetcode-api-proxy.onrender.com",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
      }
);

// ✅ GFG Stats API
app.get("/api/gfg/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(`https://auth.geeksforgeeks.org/user/${username}/practice/`);
    const html = response.data;

    // Very basic regex to extract total solved
    const match = html.match(/Total Problems Solved.*?(\d+)/);
    const totalSolved = match ? parseInt(match[1]) : 0;

    res.json({ totalSolved });
  } catch (err) {
    console.error("❌ GFG Fetch Error:", err.message);
    res.status(500).json({ error: "Failed to fetch GFG stats" });
  }
});

    console.log("📤 Responding with:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error in /api/leetcode:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// Database Connection & Server Start
mongoose.connect(DB_PATH)
  .then(() => {
    console.log('✅ Connected to Mongo');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting to Mongo:', err);
  });