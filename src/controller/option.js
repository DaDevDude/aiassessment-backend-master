const { createError } = require("../utils/error");
const { Op } = require("sequelize");
const db = require("../../models")
const createOption = async (req, res, next) => {
  try {
    const [option, created] = await db.Option.findOrCreate({
      where: {
        [Op.and]: [
          { optionText: req.body.optionText },
          { questionId: req.body.questionId },
        ],
      },
      defaults: req.body,
    });
    if (!created) {
      throw createError("Option already exists", 409);
    }
    res.status(200).json({
      status: "success",
      result: option,
    });
  } catch (error) {
    next(error);
  }
};
const getOptionsForQuestion = async (req, res, next) => {
  try {
    const questionId = req.params.questionId;
    const options = await db.Option.findAll({ where: { questionId } });
    if (!options.length) {
      throw createError("Options not found", 409);
    }
    res.status(200).json({
      status: "success",
      result: options,
    });
  } catch (error) {
    next(error);
  }
};
const getOption = async (req, res, next) => {
    try {
      const optionId = req.params.optionId;
      const option = await db.Option.findOne({ where: { id: optionId } });
      if (!option) {
        throw createError("Option not found", 409);
      }
      res.status(200).json({
        status: "success",
        result: option,
      });
    } catch (error) {
      next(error);
    }
  };
module.exports = {createOption,getOptionsForQuestion,getOption}