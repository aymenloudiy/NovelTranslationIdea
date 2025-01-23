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
