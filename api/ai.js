// api/ai.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const prompt =
    req.method === "POST"
      ? req.body.prompt
      : req.query.prompt || "Hello world";

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const COHERE_KEY = process.env.COHERE_API_KEY;

    // ✅ new Cohere Chat API endpoint
    const resp = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r", // or "command-r-plus" if available
        message: prompt,
      }),
    });

    const data = await resp.json();

    // ✅ Chat API returns response.text field
    const text = data.text?.trim() || JSON.stringify(data, null, 2);

    res.status(200).json({ ok: true, output: text });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: err.message });
  }
}
