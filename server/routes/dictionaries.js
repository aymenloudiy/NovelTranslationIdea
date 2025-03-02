import express from "express";
import { TranslationDictionary, Novel } from "../models/index.js";
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

      const dictionary = await TranslationDictionary.findAll({
        where: { novelId },
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
      .trim()
      .notEmpty()
      .withMessage("Source language is required"),
    body("targetLanguage")
      .trim()
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

      if (sourceTerm.toLowerCase() === targetTerm.toLowerCase()) {
        return res
          .status(400)
          .json({ error: "Source term and target term cannot be the same" });
      }

      const existingEntry = await TranslationDictionary.findOne({
        where: { novelId, sourceTerm },
      });

      if (existingEntry) {
        return res.status(400).json({
          error: `The term "${sourceTerm}" already exists in this novel's dictionary.`,
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
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { sourceTerm, targetTerm, sourceLanguage, targetLanguage } = req.body;

    const entry = await TranslationDictionary.findByPk(id);
    if (!entry) {
      return res.status(404).json({ error: "Dictionary entry not found" });
    }

    await entry.update({
      sourceTerm,
      targetTerm,
      sourceLanguage,
      targetLanguage,
    });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: "Failed to update dictionary entry" });
  }
});
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
