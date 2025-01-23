const { createError } = require("../utils/error");
const { Op } = require("sequelize");
const db = require("../../models")
const createTopic = async (req, res, next) => {
  try {
    const [topic, created] = await db.Topic.findOrCreate({
      where: {
        [Op.and]: [
          { name: req.body.name },
          { assessmentId: req.body.assessmentId },
        ],
      },
      defaults: req.body,
    });
    if (!created) {
      throw createError("Topic already exists", 409);
    }
    res.status(200).json({
      status: "success",
      result: topic,
    });
  } catch (error) {
    next(error);
  }
};
const getTopicsForAssessment = async (req, res, next) => {
  try {

    const assessmentId = req.params.assessmentId;
    const topics = await db.Topic.findAll({ where: { assessmentId } });
    if (!topics.length) {
      throw createError("Topics not found", 409);
    }
    res.status(200).json({
      status: "success",
      result: topics,
    });
  } catch (error) {
    next(error);
  }
};
const getTopic = async (req, res, next) => {
    try {
      const topicId = req.params.topicId;
      const topic = await db.Topic.findOne({ where: { id: topicId } });
      if (!topic) {
        throw createError("Topic not found", 409);
      }
      res.status(200).json({
        status: "success",
        result: topic,
      });
    } catch (error) {
      next(error);
    }
  };

  const saveTopics = async (req, res, next) => {
    try {
      const topics = await db.Topic.bulkCreate(req.body);
      res.status(200).json({
        status: "success",
        result: topics,
      });
    } catch (error) {
      next(error);
    }
  };
  
  const deleteTopic = async (req, res,next) => {
    try {
      const topicId = req.params.topicId
      const result = await db.Topic.destroy({
        where: { id: topicId }
      });
      if (result === 0) {
        throw createError('Topic not found',409)
      }
      res.status(200).json({
        status: "success",
        result: result,
      });
    } catch (error) {
      next(error);
    }
  };

  const updateTopic = async (req, res,next) => {
    try {
      const topicId = req.params.topicId
      const result = await db.Topic.update(
        req.body,
        {
          where: {
            id: topicId,
          },
        },
      );
      if(result && result[0] === 0 ){
        throw createError('Topic with given id does not exists',404)
      }
      res.status(200).json({
        status: "success",
        result: result,
      });
    } catch (error) {
      next(error);
    }
  };
module.exports = {createTopic,getTopicsForAssessment,getTopic,saveTopics,updateTopic,deleteTopic}