import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: "false",
});

sequelize.query("PRAGMA journal_mode = WAL");

const Novel = sequelize.define("Novel", {
  title: { type: DataTypes.TEXT, allowNull: false },
  language: { type: DataTypes.TEXT, allowNull: false },
});

const Translation = sequelize.define("Translation", {
  chapterNumber: { type: DataTypes.INTEGER, allowNull: false },
  translatedContent: { type: DataTypes.TEXT, allowNull: false },
  targetLanguage: { type: DataTypes.TEXT, allowNull: false },
});

const TranslationDictionary = sequelize.define("TranslationDictionary", {
  sourceTerm: { type: DataTypes.TEXT, allowNull: false },
  targetTerm: { type: DataTypes.TEXT, allowNull: false },
});

Novel.hasMany(Translation, { onDelete: "CASCADE" });
Translation.belongsTo(Novel);

Novel.hasMany(TranslationDictionary, { onDelete: "CASCADE" });
TranslationDictionary.belongsTo(Novel);

export { sequelize, Novel, Translation, TranslationDictionary };
