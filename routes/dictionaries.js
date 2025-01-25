import express from "express";
import { TranslationDictionary } from "../models/index.js";

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
