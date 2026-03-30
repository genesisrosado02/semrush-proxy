import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());

// SEMrush proxy
app.get("/semrush", async (req, res) => {
  try {
    const { key, ...params } = req.query;
    if (!key) return res.status(400).json({ error: "Missing API key" });

    const qs = new URLSearchParams({ key, ...params }).toString();
    const url = `https://api.semrush.com/?${qs}`;
    console.log("Calling SEMrush:", url.replace(key, "***"));

    const response = await fetch(url);
    const text = await response.text();
    console.log("SEMrush response preview:", text.slice(0, 200));
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(text);
  } catch (err) {
    console.error("SEMrush error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Claude proxy
app.post("/claude", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    console.error("Claude error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Handle preflight
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`✅ SEMrush proxy running at http://localhost:${PORT}`);
});
