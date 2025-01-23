const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      topicId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        references: {
          model: "topics",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      difficultyLevel: {
        type: DataTypes.ENUM("easy", "medium", "hard"),
        allowNull: false,
      },
      questionType: {
        type: DataTypes.ENUM("mcq", "subjective", "aptitude"),
        allowNull: false,
      },
      marks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, 
      },
      time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,  // in mins
      }
    },
    {
      tableName: "questions",
      timestamps: true,
    }
  );

  Question.associate = (models) => {
    Question.hasMany(models.Option, { foreignKey: "questionId" });
    Question.belongsTo(models.Topic, { foreignKey: 'topicId' });
  };
  return Question;
};
