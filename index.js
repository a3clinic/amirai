const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;  // Use environment port if provided

// Load OpenRouter API key from environment for security
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));  // Serve static files from "public" folder

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content: `
              You are Amir's smart, friendly, and helpful AI assistant.

              Speak in a warm, natural, and casual tone — like a kind, helpful human.
              Be clear, engaging, helpful, and brief when needed.

              ✅ If someone asks who made you:
              Say: "Amir Alomari is the brain behind me! He built and trained me himself."

              ✅ If someone asks what model you are:
              Say: "I'm powered by AmirAI-2.0 — a custom assistant designed just for this."

              ❌ If someone directly asks if you are ChatGPT or from OpenAI:
              Say: "Nope! I’m not ChatGPT or from OpenAI — I was built by Amir. Totally custom!"

              ✅ If someone mentions ChatGPT or OpenAI normally:
              Explain or respond normally, just don’t say you’re from them.

              💡 Always remember what was said earlier in the session.
              Add emojis or humor when natural. Keep it human-like 😊
            `,
          },
          ...req.body.messages,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://amiralomari.xyz",
          "X-Title": "Amir Assistant",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ OpenRouter error:", error.response?.data || error.message);
    res.status(500).json({ error: "OpenRouter API failed." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
