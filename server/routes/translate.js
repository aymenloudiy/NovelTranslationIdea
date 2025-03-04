import express from "express";
import { Translation, Novel } from "../models/index.js";
import { body, validationResult, query } from "express-validator";

const router = express.Router();

router.get(
  "/novel/:novelId",
  query("limit").optional().isInt({ min: 1 }).toInt(),
  query("offset").optional().isInt({ min: 0 }).toInt(),
  query("targetLanguage").optional().isString(),
  async (req, res) => {
    try {
      const { novelId } = req.params;
      const { targetLanguage, limit = 10, offset = 0 } = req.query;

      const whereClause = { novelId };
      if (targetLanguage) {
        whereClause.targetLanguage = targetLanguage;
      }

      const translations = await Translation.findAll({
        where: whereClause,
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
    body("sourceLanguage")
      .notEmpty()
      .withMessage("Source language is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { novelId } = req.params;
      const {
        chapterNumber,
        translatedContent,
        targetLanguage,
        sourceLanguage,
      } = req.body;

      const novel = await Novel.findByPk(novelId);
      if (!novel) {
        return res.status(404).json({ error: "Novel not found" });
      }

      const existingTranslation = await Translation.findOne({
        where: { novelId, chapterNumber, targetLanguage },
      });

      if (existingTranslation) {
        return res.status(400).json({
          error: `Chapter ${chapterNumber} is already translated into ${targetLanguage}.`,
        });
      }

      const translation = await Translation.create({
        novelId,
        chapterNumber,
        translatedContent,
        sourceLanguage,
        targetLanguage,
      });

      res.status(201).json(translation);
    } catch (error) {
      res.status(500).json({ error: "Failed to create translation" });
    }
  }
);

export default router;
