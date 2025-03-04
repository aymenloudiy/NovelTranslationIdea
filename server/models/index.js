import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

sequelize.query("PRAGMA journal_mode = WAL;");

const Novel = sequelize.define(
  "Novel",
  {
    title: { type: DataTypes.TEXT, allowNull: false },
    language: { type: DataTypes.TEXT, allowNull: false },
  },
  { timestamps: true }
);

const Translation = sequelize.define(
  "Translation",
  {
    chapterNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    translatedContent: { type: DataTypes.TEXT, allowNull: false },
    sourceLanguage: { type: DataTypes.TEXT, allowNull: false },
    targetLanguage: { type: DataTypes.TEXT, allowNull: false },
  },
  { timestamps: true }
);

Translation.addHook("beforeValidate", async (translation) => {
  const existing = await Translation.findOne({
    where: {
      novelId: translation.novelId,
      chapterNumber: translation.chapterNumber,
      targetLanguage: translation.targetLanguage,
    },
  });
  if (existing && translation.id !== existing.id) {
    throw new Error(
      `Chapter ${translation.chapterNumber} already exists for this novel in ${translation.targetLanguage}.`
    );
  }
});

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

TranslationDictionary.addHook("beforeValidate", async (entry) => {
  const existing = await TranslationDictionary.findOne({
    where: {
      novelId: entry.novelId,
      sourceTerm: entry.sourceTerm,
      sourceLanguage: entry.sourceLanguage,
      targetLanguage: entry.targetLanguage,
    },
  });
  if (existing && entry.id !== existing.id) {
    throw new Error(
      `Term "${entry.sourceTerm}" already exists for ${entry.sourceLanguage} → ${entry.targetLanguage}.`
    );
  }
});

Novel.hasMany(Translation, { onDelete: "CASCADE" });
Translation.belongsTo(Novel);

Novel.hasMany(TranslationDictionary, { onDelete: "CASCADE" });
TranslationDictionary.belongsTo(Novel);

export { sequelize, Novel, Translation, TranslationDictionary };
