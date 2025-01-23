
const db = require("../../models");
const { createError } = require("../utils/error");
const saveAnswer = async (req, res,next) => {
    try {
      const answerId = req.params.answerId;
      const result = await db.Answer.update(req.body, { where: { id: answerId } });
      if(result && result[0] === 0 ){
        throw createError('Answer with given id does not exists',404)
      }
      const updatedAnswer = await db.Answer.findOne({
        where: {
          id: answerId
        }
      });
      res.status(200).json({
        status: "success",
        result: updatedAnswer,
      });
    } catch (error) {
      next(error);
    }
  };
module.exports = {saveAnswer}