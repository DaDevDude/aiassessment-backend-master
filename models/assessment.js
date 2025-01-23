const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define(
    "Assessment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      experience: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalTopics: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER, // Storing duration in seconds
        allowNull: false,
        defaultValue: 3600, // Default to 1 hour (3600 seconds)
      },
    },
    {
      tableName: "assessments",
      timestamps: true,
    }
  );

  Assessment.associate = (models) => {
    Assessment.hasMany(models.Topic, { foreignKey: "assessmentId" });
    Assessment.hasMany(models.Report, { foreignKey: "assessmentId" });
  };

  return Assessment;
};
