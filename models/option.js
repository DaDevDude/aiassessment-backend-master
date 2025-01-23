const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define(
    "Option",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      questionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "questions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      optionText: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      tableName: "options",
      timestamps: true,
    }
  );
  return Option;
};
