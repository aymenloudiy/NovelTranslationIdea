import express from "express";
import { TranslationDictionary, Novel } from "../models/index.js";
import { body, validationResult, query } from "express-validator";

const router = express.Router();

router.get(
  "/novel/:novelId",
  query("limit").optional().isInt({ min: 1 }).toInt(),
  query("offset").optional().isInt({ min: 0 }).toInt(),
  query("sourceLanguage").optional().isString(),
  query("targetLanguage").optional().isString(),
  async (req, res) => {
    try {
      const { novelId } = req.params;
      const {
        sourceLanguage,
        targetLanguage,
        limit = 10,
        offset = 0,
      } = req.query;

      const whereClause = { novelId };
      if (sourceLanguage) whereClause.sourceLanguage = sourceLanguage;
      if (targetLanguage) whereClause.targetLanguage = targetLanguage;

      const dictionary = await TranslationDictionary.findAll({
        where: whereClause,
        limit,
        offset,
        order: [["sourceTerm", "ASC"]],
      });

      res.json(dictionary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dictionary entries" });
    }
  }
);

router.post(
  "/novel/:novelId",
  [
    body("sourceTerm").trim().notEmpty().withMessage("Source term is required"),
    body("targetTerm").trim().notEmpty().withMessage("Target term is required"),
    body("sourceLanguage")
      .notEmpty()
      .withMessage("Source language is required"),
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
      const { sourceTerm, targetTerm, sourceLanguage, targetLanguage } =
        req.body;

      const novel = await Novel.findByPk(novelId);
      if (!novel) {
        return res.status(404).json({ error: "Novel not found" });
      }

      const existingEntry = await TranslationDictionary.findOne({
        where: { novelId, sourceTerm, sourceLanguage, targetLanguage },
      });

      if (existingEntry) {
        return res.status(400).json({
          error: `The term "${sourceTerm}" already exists for ${sourceLanguage} → ${targetLanguage}.`,
        });
      }

      const entry = await TranslationDictionary.create({
        novelId,
        sourceTerm,
        targetTerm,
        sourceLanguage,
        targetLanguage,
      });

      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to create dictionary entry" });
    }
  }
);

router.put(
  "/:id",
  [
    body("sourceTerm")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Source term cannot be empty"),
    body("targetTerm")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Target term cannot be empty"),
    body("sourceLanguage")
      .optional()
      .notEmpty()
      .withMessage("Source language is required"),
    body("targetLanguage")
      .optional()
      .notEmpty()
      .withMessage("Target language is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { sourceTerm, targetTerm, sourceLanguage, targetLanguage } =
        req.body;

      const entry = await TranslationDictionary.findByPk(id);
      if (!entry) {
        return res.status(404).json({ error: "Dictionary entry not found" });
      }

      if (sourceTerm || sourceLanguage || targetLanguage) {
        const duplicate = await TranslationDictionary.findOne({
          where: {
            novelId: entry.novelId,
            sourceTerm: sourceTerm || entry.sourceTerm,
            sourceLanguage: sourceLanguage || entry.sourceLanguage,
            targetLanguage: targetLanguage || entry.targetLanguage,
          },
        });
        if (duplicate && duplicate.id !== Number(id)) {
          return res.status(400).json({
            error: `The term "${sourceTerm}" already exists for ${sourceLanguage} → ${targetLanguage}.`,
          });
        }
      }

      await entry.update(req.body);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update dictionary entry" });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await TranslationDictionary.findByPk(id);
    if (!entry) {
      return res.status(404).json({ error: "Dictionary entry not found" });
    }

    await entry.destroy();
    res.json({ message: "Dictionary entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete dictionary entry" });
  }
});

export default router;
