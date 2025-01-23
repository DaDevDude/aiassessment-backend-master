const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    candidateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "candidates",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    assessmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "assessments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    proctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "proctors",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("completed", "inprogress"),
      allowNull: false,
      defaultValue: "inprogress",
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
  },
  {
    tableName: "reports",
    timestamps: true,
  }
);

Report.associate = (models) => {
  Report.hasMany(models.Answer,{ foreignKey: 'reportId',as:'answers' });
  Report.belongsTo(models.Proctor,{ foreignKey: 'proctorId',as: 'proctor',onDelete: 'CASCADE'});
  Report.belongsTo(models.Candidate, { foreignKey: 'candidateId',as: 'candidate' });
};

return Report;
}
