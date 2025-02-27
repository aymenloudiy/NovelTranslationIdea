import express from "express";
import { OpenAI } from "openai";
import { encoding_for_model } from "tiktoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const apiKey = process.env.OPEN_AI_KEY;
if (!apiKey) {
  console.error("OpenAI API key is missing. Set OPEN_AI_KEY in the .env file.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });
const MAX_TOKENS = 8192;

const estimateTokens = (text) => {
  const encoding = encoding_for_model("gpt-4o");
  const tokens = encoding.encode(text);
  encoding.free();
  return tokens.length;
};

const systemMessage = `
You are an expert translator specializing in translating Chinese web novels into English, ensuring cultural nuances and authenticity. Follow these rules:

1. **Input**: A JSON object with:
   - "names": Dictionary of translated names (e.g., { "王小明": "Wang Xiaoming" }).
   - "raw_text": The Chinese text to translate.

2. **Output**: Return a JSON object with:
   - "dictionary": Include all existing and new translated names.
   - "translated_text": Accurate English translation of "raw_text".

3. **Guidelines**:
   - Use "names" for consistency in proper nouns and titles.
   - Translate idioms literally but maintain cultural expressions.
   - Ensure proper grammar and coherence in English.
   - Add new names to "dictionary" without overwriting existing entries.

4. **Constraints**:
   - Do not add explanations or commentary.
   - Do not expand ambiguous phrases unless explicit in the source.
   - Avoid grammatical errors and non-translatable terms (e.g., "iPhone" stays "iPhone").
`;

router.post("/", async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    return res
      .status(400)
      .json({ error: "'question' is required and must be a string." });
  }
  try {
    const userTokens = estimateTokens(question);
    console.log(`User input tokens: ${userTokens}`);
    const systemTokens = estimateTokens(systemMessage);
    const remainingTokens = MAX_TOKENS - (systemTokens + userTokens);
    if (remainingTokens <= 0) {
      return res
        .status(400)
        .json({ error: "Input is too long and exceeds token limits." });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 150000);

    const response = await openai.chat.completions.create(
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: remainingTokens,
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);
    res.json({
      success: true,
      data: response.choices[0].message.content,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return res
        .status(504)
        .json({ error: "Request timed out. Please try again later." });
    }

    if (error.response) {
      console.error(
        "OpenAI API Error:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("Unexpected Error:", error.message);
    }

    res.status(500).json({
      error: "Failed to process the request. Please try again later.",
    });
  }
});

export default router;
