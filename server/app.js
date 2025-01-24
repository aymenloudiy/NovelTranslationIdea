import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";

const app = express();
const port = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await sequelize.sync();
    console.log("Database synced!");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Unable to start server:", error);
  }
})();
