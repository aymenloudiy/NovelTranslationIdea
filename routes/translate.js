import express from "express";
import { OpenAI } from "openai";
import { encoding_for_model } from "tiktoken";

const router = express.Router();
if (!apiKey) {
  throw new Error("OpenAI API key is not defined in environment variables.");
}

const openai = new OpenAI({ apiKey });
const MAX_TOKENS = 8192;

const estimateTokens = (text) => {
  const encoding = encoding_for_model("gpt-4");
  const tokens = encoding.encode(text);
  encoding.free();
  return tokens.length;
};
app.post("/api/translate", async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    return res
      .status(400)
      .json({ error: "'question' is required and must be a string." });
  }
  const userTokens = estimateTokens(question);
  console.log(`User input tokens: ${userTokens}`);
  const systemMessage = "DONT FORGET TO ADD DEFAULT SYSTEM MESSAGE AGAIN";
  const systemTokens = estimateTokens(systemMessage);
  const remainingTokens = MAX_TOKENS - (systemTokens + userTokens);
  if (remainingTokens <= 0) {
    return res
      .status(400)
      .json({ error: "Input is too long and exceeds token limits." });
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
            You are an expert translator specializing in translating Chinese web novels into English, ensuring cultural nuances and authenticity. Follow these rules:
    
            1. **Input**: A JSON object with:
               - "names": Dictionary of translated names (e.g., { "王小明": "Wang Xiaoming" }).
               - "raw_text": The Chinese text to translate.
    
            2. **Output**: Return a JSON object with:
               - "updated_names": Include all existing and new translated names.
               - "translated_text": Accurate English translation of "raw_text".
    
            3. **Guidelines**:
               - Use "names" for consistency in proper nouns and titles.
               - Translate idioms literally but maintain cultural expressions.
               - Ensure proper grammar and coherence in English.
               - Add new names to "updated_names" without overwriting existing entries.
    
            4. **Constraints**:
               - Do not add explanations or commentary.
               - Do not expand ambiguous phrases unless explicit in the source.
               - Avoid grammatical errors and non-translatable terms (e.g., "iPhone" stays "iPhone").
    
            5. **Example**:
            Input:
            {
              "names": { "王小明": "Wang Xiaoming" },
              "raw_text": "王小明走进了房间，并看到了李华。"
            }
    
            Output:
            {
              "updated_names": { "王小明": "Wang Xiaoming", "李华": "Li Hua" },
              "translated_text": "Wang Xiaoming walked into the room and saw Li Hua."
            }
            `,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });
  clearTimeout(timeout);
  res.send(response.choices[0].message.content);
});

export default router;
