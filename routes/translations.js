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
    const {
      chapterNumber,
      chapterTitle,
      translatedContent,
      targetLanguage,
      translatorName,
    } = req.body;

    const novel = await Novel.findByPk(novelId);
    if (!novel) {
      return res.status(404).json({ error: "Novel not found" });
    }

    const translation = await Translation.create({
      novelId,
      chapterNumber,
      chapterTitle,
      translatedContent,
      targetLanguage,
      translatorName,
    });
    res.status(201).json(translation);
  } catch (error) {
    res.status(500).json({ error: "Failed to create translation" });
  }
});
