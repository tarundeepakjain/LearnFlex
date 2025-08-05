// backend/server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
