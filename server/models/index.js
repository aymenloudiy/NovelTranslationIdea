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
    novelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Novel,
        key: "id",
      },
    },
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

const TranslationDictionary = sequelize.define(
  "TranslationDictionary",
  {
    novelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Novel,
        key: "id",
      },
    },
    sourceTerm: { type: DataTypes.TEXT, allowNull: false },
    targetTerm: { type: DataTypes.TEXT, allowNull: false },
    sourceLanguage: { type: DataTypes.TEXT, allowNull: false },
    targetLanguage: { type: DataTypes.TEXT, allowNull: false },
  },
  { timestamps: true }
);

TranslationDictionary.addHook("beforeValidate", async (entry) => {
  if (!entry.novelId && entry.id) {
    const existingEntry = await TranslationDictionary.findByPk(entry.id);
    if (existingEntry) {
      entry.novelId = existingEntry.novelId;
    }
  }

  if (!entry.novelId) {
    throw new Error("Novel ID is required for dictionary entries.");
  }

  const conflict = await TranslationDictionary.findOne({
    where: {
      novelId: entry.novelId,
      sourceTerm: entry.sourceTerm,
      sourceLanguage: entry.sourceLanguage,
      targetLanguage: entry.targetLanguage,
    },
  });
  const isSame = conflict && entry.id && conflict.id === entry.id;
  if (conflict && !isSame) {
    throw new Error(
      `The term "${entry.sourceTerm}" already exists for ${entry.sourceLanguage} → ${entry.targetLanguage}.`
    );
  }
});

Novel.hasMany(Translation, { foreignKey: "novelId", onDelete: "CASCADE" });
Translation.belongsTo(Novel, { foreignKey: "novelId", onDelete: "CASCADE" });

Novel.hasMany(TranslationDictionary, {
  foreignKey: "novelId",
  onDelete: "CASCADE",
});
TranslationDictionary.belongsTo(Novel, {
  foreignKey: "novelId",
  onDelete: "CASCADE",
});

export { sequelize, Novel, Translation, TranslationDictionary };
