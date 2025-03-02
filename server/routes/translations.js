import express from "express";
import { Translation, Novel } from "../models/index.js";
import { body, validationResult, query } from "express-validator";

const router = express.Router();

router.get(
  "/novel/:novelId",
  query("limit").optional().isInt({ min: 1 }).toInt(),
  query("offset").optional().isInt({ min: 0 }).toInt(),
  async (req, res) => {
    try {
      const { novelId } = req.params;
      const limit = req.query.limit || 10;
      const offset = req.query.offset || 0;

      const translations = await Translation.findAll({
        where: { novelId },
        limit,
        offset,
        order: [["chapterNumber", "ASC"]],
      });

      res.json(translations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  }
);

router.post(
  "/novel/:novelId",
  [
    body("chapterNumber")
      .isInt({ min: 1 })
      .withMessage("Chapter number must be a positive integer"),
    body("translatedContent")
      .notEmpty()
      .withMessage("Translated content is required"),
    body("targetLanguage")
      .notEmpty()
      .withMessage("Target language is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { novelId } = req.params;
      const { chapterNumber, translatedContent, targetLanguage } = req.body;
      const novel = await Novel.findByPk(novelId);
      if (!novel) {
        return res.status(404).json({ error: "Novel not found" });
      }
      const existingTranslation = await Translation.findOne({
        where: { novelId, chapterNumber, targetLanguage },
      });
      if (existingTranslation) {
        return res.status(400).json({
          error: `Chapter ${chapterNumber} already has a translation in ${targetLanguage}.`,
        });
      }
      const translation = await Translation.create({
        novelId,
        chapterNumber,
        translatedContent,
        targetLanguage,
      });
      res.status(201).json(translation);
    } catch (error) {
      res.status(500).json({ error: "Failed to create translation" });
    }
  }
);
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { chapterNumber, translatedContent, targetLanguage } = req.body;

    const translation = await Translation.findByPk(id);
    if (!translation) {
      return res.status(404).json({ error: "Translation not found" });
    }

    await translation.update({
      chapterNumber,
      translatedContent,
      targetLanguage,
    });
    res.json(translation);
  } catch (error) {
    res.status(500).json({ error: "Failed to update translation" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const translation = await Translation.findByPk(id);
    if (!translation) {
      return res.status(404).json({ error: "Translation not found" });
    }

    await translation.destroy();
    res.json({ message: "Translation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete translation" });
  }
});

export default router;
