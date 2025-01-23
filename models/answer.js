const { Sequelize } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
const Answer = sequelize.define(
  "Answer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    reportId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "reports",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    selectedOptionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "options",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    markedForReview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    providedAnswer: {
      type: DataTypes.TEXT,
      defaultValue: "",
      allowNull: true,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull: true,
    },
  },
  {
    tableName: "answers",
    timestamps: true,
  }
);

Answer.associate = (models) => {
  Answer.belongsTo(models.Question,{ foreignKey: 'questionId'});
};
return Answer;
}
