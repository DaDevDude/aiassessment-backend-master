const { createError } = require("../utils/error");
const { Op } = require("sequelize");
const db = require("../../models")
const createQuestion = async (req, res, next) => {
  try {
    const [question, created] = await db.Question.findOrCreate({
      where: {
        [Op.and]: [
          { question: req.body.question },
          { topicId: req.body.topicId },
        ],
      },
      defaults: req.body,
    });
    if (!created) {
      throw createError("Question already exists", 409);
    }
    res.status(200).json({
      status: "success",
      result: question,
    });
  } catch (error) {
    next(error);
  }
};
const getQuestiosForAssessment = async (req, res, next) => {
  try {
    const topicId = req.params.topicId;
    const questions = await db.Question.findAll({ where: { topicId } });
    if (!questions.length) {
      throw createError("Questions not found", 409);
    }
    res.status(200).json({
      status: "success",
      result: questions,
    });
  } catch (error) {
    next(error);
  }
};
const getQuestion = async (req, res, next) => {
  try {
    const questionId = req.params.questionId;
    const question = await db.Question.findOne({ where: { id: questionId } });
    if (!question) {
      throw createError("Question not found", 409);
    }
    res.status(200).json({
      status: "success",
      result: question,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { createQuestion, getQuestiosForAssessment, getQuestion };
