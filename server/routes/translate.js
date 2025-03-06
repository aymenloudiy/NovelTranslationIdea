import express from "express";
import { OpenAI } from "openai";
import { encoding_for_model } from "tiktoken";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { Novel, Translation, TranslationDictionary } from "../models/index.js";
import { body, validationResult } from "express-validator";

dotenv.config();

const router = express.Router();

const apiKey = process.env.OPEN_AI_KEY;

if (!apiKey) {
  console.error("OpenAI API key is missing. Set OPEN_AI_KEY in the .env file.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });
const MAX_TOKENS = 8192;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: "Too many requests, please try again later." },
});

const estimateTokens = (text) => {
  const encoding = encoding_for_model("gpt-4o");
  const tokens = encoding.encode(text);
  encoding.free();
  return tokens.length;
};

router.post(
  "/",
  limiter,
  [
    body("novelId")
      .isInt({ min: 1 })
      .withMessage("Valid novel ID is required."),
    body("chapterNumber")
      .isInt({ min: 1 })
      .optional()
      .withMessage("Chapter number must be a positive integer."),
    body("targetLanguage")
      .notEmpty()
      .withMessage("Target language is required."),
    body("raw_text").notEmpty().withMessage("Raw text is required."),
    body("dictionary")
      .optional()
      .isObject()
      .withMessage("Dictionary must be an object."),
  ],
  async (req, res) => {
    console.log("Request body received:", req.body);
    console.log("Extracted novelId:", req.body.novelId);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        novelId,
        chapterNumber,
        targetLanguage,
        raw_text,
        dictionary = {},
      } = req.body;

      const novel = await Novel.findByPk(novelId);
      if (!novel) {
        return res.status(404).json({ error: "Novel not found." });
      }

      let finalChapterNumber = chapterNumber;

      if (!chapterNumber) {
        const lastChapter = await Translation.findOne({
          where: { novelId },
          order: [["chapterNumber", "DESC"]],
        });

        finalChapterNumber = lastChapter ? lastChapter.chapterNumber + 1 : 1;
      }

      const userTokens = estimateTokens(raw_text);
      const systemTokens = estimateTokens(systemMessage(targetLanguage));
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
            { role: "system", content: systemMessage(targetLanguage) },
            { role: "user", content: JSON.stringify({ dictionary, raw_text }) },
          ],
          max_tokens: remainingTokens,
        },
        { signal: controller.signal }
      );

      clearTimeout(timeout);

      const aiResponse = JSON.parse(response.choices[0].message.content);
      const translatedText = aiResponse.translated_text;
      const detectedSourceLanguage = aiResponse.detected_source_language;
      const updatedDictionary = aiResponse.dictionary;
      console.log(novelId);

      const translation = await Translation.create({
        novelId: novelId,
        chapterNumber: finalChapterNumber,
        translatedContent: translatedText,
        sourceLanguage: detectedSourceLanguage,
        targetLanguage,
      });
      console.log("Created Translation:", translation.toJSON());
      for (const [sourceTerm, targetTerm] of Object.entries(
        updatedDictionary
      )) {
        if (!novelId || isNaN(novelId)) {
          console.error(
            "Error: novelId is missing or invalid before updating dictionary."
          );
          continue;
        }

        console.log(
          "Creating dictionary entry for:",
          sourceTerm,
          "->",
          targetTerm,
          "novelId:",
          novelId
        );

        const existingEntry = await TranslationDictionary.findOne({
          where: {
            novelId,
            sourceTerm,
            sourceLanguage: detectedSourceLanguage,
            targetLanguage,
          },
        });

        if (!existingEntry) {
          await TranslationDictionary.create({
            novelId,
            sourceTerm,
            targetTerm,
            sourceLanguage: detectedSourceLanguage,
            targetLanguage,
          });

          console.log(
            `Added dictionary entry for ${sourceTerm} -> ${targetTerm} under novelId: ${novelId}`
          );
        }
      }

      res.json({
        success: true,
        translated_text: translatedText,
        detected_source_language: detectedSourceLanguage,
        dictionary: updatedDictionary,
        chapterNumber: finalChapterNumber,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        return res
          .status(504)
          .json({ error: "Request timed out. Please try again later." });
      }

      console.error("Translation Error:", error);
      res
        .status(500)
        .json({ error: "Failed to process the translation request." });
    }
  }
);

const systemMessage = (targetLanguage) => `
You are an expert AI translator. Your task is to translate novels into ${targetLanguage} while preserving cultural nuances. You must **only** return a **valid JSON object** and nothing else.

### **Input Format**
A JSON object:
\`\`\`json
{
  "dictionary": { "王小明": "Wang Xiaoming" },
  "raw_text": "王小明走进了房间，并看到了李华。"
}
\`\`\`

### **Output Format**
Return **only** this JSON format, without any additional comments, explanations, or text:
\`\`\`json
{
  "detected_source_language": "Chinese",
  "dictionary": { "王小明": "Wang Xiaoming", "李华": "Li Hua" },
  "translated_text": "Wang Xiaoming walked into the room and saw Li Hua."
}
\`\`\`

Strict rules:
- **Return only a JSON object.** No Markdown, no explanations.
- **Do not include text before or after the JSON.**
- **Do not format the output inside triple backticks (\`\`\`json ... \`\`\`).**
`;

export default router;
