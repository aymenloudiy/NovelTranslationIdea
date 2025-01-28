import express from "express";
import { Novel } from "../models/index.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const novels = await Novel.findAll();
    res.json(novels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch novels" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const novel = await Novel.findByPk(req.params.id);
    if (!novel) {
      return res.status(404).json({ error: "Novel not found" });
    }
    res.json(novel);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch novel" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { title, genre, language } = req.body;
    const novel = await Novel.create({ title, genre, language });
    res.status(201).json(novel);
  } catch (error) {
    res.status(500).json({ error: "Failed to create novel" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const novel = await Novel.findByPk(req.params.id);
    if (!novel) {
      return res.status(404).json({ error: "Novel not found" });
    }
    await novel.destroy();
    res.json({ message: "Novel deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete novel" });
  }
});

export default router;
