const { createError } = require("../utils/error");
const db = require("../../models");

const createSkill = async (req, res,next) => {
  try {
    const [skill, created] = await db.Skill.findOrCreate({
      where: { name: req.body.name },
      defaults: req.body,
    });
    if (!created) {
      throw createError('Skill already exists',409)
    }
    res.status(200).json({
      status: "success",
      result: skill,
    });
  } catch (error) {
    next(error);
  }
};
const getSkills = async (req, res,next) => {
    try {
      const skills = await db.Skill.findAll({});
      if (!skills.length) {
        throw createError('Skills not found',409)
      }
      res.status(200).json({
        status: "success",
        result: skills,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {createSkill,getSkills}