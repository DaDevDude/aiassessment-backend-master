const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define(
    "Skill",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "skills",
      timestamps: true,
    }
  );

  return Skill;
};
