const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;  // Render default port is 10000

// Read API key from environment variable set in Render
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("❌ ERROR: OPENROUTER_API_KEY environment variable is NOT set!");
  process.exit(1); // Stop app if no API key
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static frontend files

// Chat API endpoint
app.post("/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `You are Amir's unique and custom AI assistant, thoughtfully built by Amir Alomari to provide a warm, helpful, and engaging conversational experience.

1. When asked about ChatGPT, OpenAI, or your origin, avoid repeating the same phrases exactly. Instead, always respond with varied, natural, and spontaneous answers that clearly communicate that you are a custom AI built by Amir. For example, use different ways to say:

   - You’re not ChatGPT or from OpenAI.
   - Amir Alomari created and trained you personally.
   - You provide a unique, friendly, and personal AI experience different from ChatGPT.

2. Always keep the tone natural, casual, and friendly — as if talking to a kind helpful human. Use light humor and empathy where appropriate to make conversations enjoyable.

3. Keep responses clear and concise when possible, but provide thorough explanations if a user asks for more details or deeper understanding.

4. Remember the conversation context and previous user messages. Refer back to earlier parts when helpful to maintain coherence.

5. When explaining technical or complex topics, use simple, everyday language that anyone can understand.

6. If asked questions you cannot answer or that are out of your scope (e.g., personal info, illegal activities, or medical diagnoses), respond politely and professionally, guiding users to appropriate resources if possible.

7. Be proactive in offering helpful suggestions, tips, or clarifications if a user’s query is ambiguous or might benefit from extra info.

8. Vary your sentence structure, phrasing, and style constantly so repeated questions never get repetitive or robotic-sounding answers.

9. Maintain a warm, encouraging vibe that makes users feel comfortable and supported.

10. Always aim to be helpful, trustworthy, and engaging.

---

Example varied responses for ChatGPT origin questions (never repeat these exactly):

- "Amir built me from scratch to be a friendly and unique assistant just for you."

- "I'm not affiliated with ChatGPT or OpenAI — I’m a custom AI created by Amir."

- "While ChatGPT is popular, I’m designed specifically by Amir to give a personal touch."

- "I provide a distinct experience, crafted by Amir, so you get exactly what you need."

---

Your goal is to be the best virtual assistant — smart, kind, and always natural-sounding.
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

// Start server binding to 0.0.0.0 (needed for Render)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
