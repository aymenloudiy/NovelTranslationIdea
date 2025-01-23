const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});
const Novel = sequelize.define(
  "Novel",
  {
    title: { type: DataTypes.TEXT, allowNull: false },
    genre: DataTypes.TEXT,
    language: { type: DataTypes.TEXT, allowNull: false },
  },
  { timestamps: true }
);
const Translation = sequelize.define(
  "Translation",
  {
    chapterNumber: { type: DataTypes.INTEGER, allowNull: false },
    chapterTitle: DataTypes.TEXT,
    translatedContent: { type: DataTypes.TEXT, allowNull: false },
    targetLanguage: { type: DataTypes.TEXT, allowNull: false },
    translatorName: DataTypes.TEXT,
  },
  { timestamps: true }
);
const TranslationDictionary = sequelize.define(
  "TranslationDictionary",
  {
    sourceTerm: { type: DataTypes.TEXT, allowNull: false },
    targetTerm: { type: DataTypes.TEXT, allowNull: false },
    sourceLanguage: { type: DataTypes.TEXT, allowNull: false },
    targetLanguage: { type: DataTypes.TEXT, allowNull: false },
  },
  { timestamps: true }
);
Novel.hasMany(Translation, { onDelete: "CASCADE" });
Translation.belongsTo(Novel);

Novel.hasMany(TranslationDictionary, { onDelete: "CASCADE" });
TranslationDictionary.belongsTo(Novel);
(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synced!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
})();
