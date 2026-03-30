// server.js
// Run: npm install express cors node-fetch && node server.js

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3001;

app.use(cors()); // Allow requests from the Claude artifact
app.use(express.json());

app.get("/semrush", async (req, res) => {
  try {
    const { key, ...params } = req.query;
    if (!key) return res.status(400).json({ error: "Missing API key" });

    const qs = new URLSearchParams({ key, ...params }).toString();
    const url = `https://api.semrush.com/?${qs}`;

    const response = await fetch(url);
    const text = await response.text();
    res.setHeader("Content-Type", "text/plain");
    res.send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ SEMrush proxy running at http://localhost:${PORT}`);
});
