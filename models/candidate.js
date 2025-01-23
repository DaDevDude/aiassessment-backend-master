const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define(
    "Candidate",
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      linkedin: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
      },
      resume: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
      },
    },
    {
      tableName: "candidates",
      timestamps: true,
    }
  );
  Candidate.associate = (models) => {
    Candidate.hasMany(models.Report, { foreignKey: "candidateId" });
  };
  return Candidate
};
