import express from "express";
import { TranslationDictionary, Novel } from "../models/index.js";

const router = express.Router();
router.get("/novel/:novelId", async (req, res) => {
  try {
    const { novelId } = req.params;
    const dictionary = await TranslationDictionary.findAll({
      where: { novelId },
    });
    res.json(dictionary);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dictionary entries" });
  }
});
router.post("/novel/:novelId", async (req, res) => {
  try {
    const { novelId } = req.params;
    const { sourceTerm, targetTerm, sourceLanguage, targetLanguage } = req.body;

    const novel = await Novel.findByPk(novelId);
    if (!novel) {
      return res.status(404).json({ error: "Novel not found" });
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
});
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
