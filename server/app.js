import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import novelRoutes from "./routes/novels.js";
import translationsRoutes from "./routes/translations.js";
import dictionaryRoutes from "./routes/dictionaries.js";
import translateRoutes from "./routes/translate.js";

const app = express();
const port = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

app.use("/api/novels", novelRoutes);
app.use("/api/translations", translationsRoutes);
app.use("/api/dictionaries", dictionaryRoutes);
app.use("/api/translate", translateRoutes);

app.get("/", (req, res) => {
  res.send({ status: "OK", message: "Server is running" });
});

(async () => {
  try {
    await sequelize.sync();
    console.log("Database synced!");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Unable to start server:", error);
  }
})();

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  try {
    await sequelize.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error closing database connection:", error);
    process.exit(1);
  }
});
