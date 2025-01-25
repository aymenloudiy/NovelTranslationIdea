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
