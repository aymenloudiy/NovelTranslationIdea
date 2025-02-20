import express from "express";
import { Translation, Novel } from "../models/index.js";

const router = express.Router();

router.get("/novel/:novelId", async (req, res) => {
  try {
    const { novelId } = req.params;
    const translations = await Translation.findAll({ where: { novelId } });
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch translations" });
  }
});
router.post("/novel/:novelId", async (req, res) => {
  try {
    const { novelId } = req.params;
    const { chapterNumber, translatedContent, targetLanguage } = req.body;

    const novel = await Novel.findByPk(novelId);
    if (!novel) {
      return res.status(404).json({ error: "Novel not found" });
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
});
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
