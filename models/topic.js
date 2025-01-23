const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define(
    "Topic",
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
      assessmentId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        references: {
          model: "assessments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "topics",
      timestamps: true,
    }
  );

  Topic.associate = (models) => {
    Topic.hasMany(models.Question, { foreignKey: "topicId" });
  };
  return Topic
};
