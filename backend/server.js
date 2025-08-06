const path = require('path');

// Load env variables
require('dotenv').config();

// External Modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// App Initialization
const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = process.env.MONGO_URI;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// Proxy endpoint for LeetCode GraphQL
app.post("/api/leetcode", async (req, res) => {
  try {
    const { query } = req.body;

    const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    },
    body: JSON.stringify({ query }),
    });


    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error in /api/leetcode:", err);
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