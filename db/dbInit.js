const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const Novel = sequelize.define("Novel", {
  title: { type: DataTypes.TEXT, allowNull: false },
  genre: DataTypes.TEXT,
  language: { type: DataTypes.TEXT, allowNull: false },
});

const Translation = sequelize.define("Translation", {
  chapterNumber: { type: DataTypes.INTEGER, allowNull: false },
  chapterTitle: DataTypes.TEXT,
  translatedContent: { type: DataTypes.TEXT, allowNull: false },
  targetLanguage: { type: DataTypes.TEXT, allowNull: false },
  translatorName: DataTypes.TEXT,
});

const TranslationDictionary = sequelize.define("TranslationDictionary", {
  sourceTerm: { type: DataTypes.TEXT, allowNull: false },
  targetTerm: { type: DataTypes.TEXT, allowNull: false },
  sourceLanguage: { type: DataTypes.TEXT, allowNull: false },
  targetLanguage: { type: DataTypes.TEXT, allowNull: false },
});

Novel.hasMany(Translation, { onDelete: "CASCADE" });
Translation.belongsTo(Novel);

Novel.hasMany(TranslationDictionary, { onDelete: "CASCADE" });
TranslationDictionary.belongsTo(Novel);

module.exports = { sequelize, Novel, Translation, TranslationDictionary };
