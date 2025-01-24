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
