const { createError } = require("../utils/error");
const { Op } = require("sequelize");
const db = require("../../models");
const createAssessment = async (req, res, next) => {
  try {
    const [assessment, created] = await db.Assessment.findOrCreate({
      where: { title: req.body.title },
      defaults: req.body,
    });
    if (!created) {
      throw createError("Assessment already exists", 409);
    }
    res.status(200).json({
      status: "success",
      result: assessment,
    });
  } catch (error) {
    next(error);
  }
};
const getAssessments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortOrder = req.query.sortOrder || "DESC";
    const sortBy = req.query.sortBy || "createdAt";
    const searchBy = req.query.searchBy || "";
    const offset = (page - 1) * limit;
    let { count, rows } = await db.Assessment.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${searchBy}%` } },
          { description: { [Op.iLike]: `%${searchBy}%` } },
          { designation: { [Op.iLike]: `%${searchBy}%` } },
        ],
      },
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });
    if (!rows.length) {
      throw createError("Assessments not found", 409);
    }

    //Getting count of candidates appeared for each assessment
    rows = await Promise.all(
      rows.map(async (eachRow) => {
        eachRow = eachRow.get({ plain: true });
        let candidateCount = await db.Report.count({
          where: { assessmentId: eachRow.id },
        });
        eachRow.candidateCount = candidateCount;
        return eachRow;
      })
    );

    res.status(200).json({
      status: "success",
      result: {
        assessments: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAssessment = async (req, res, next) => {
  try {
    const assessmentId = req.params.assessmentId;
    const assessment = await getAssessmentData(assessmentId);
    if (!assessment) {
      throw createError("Assessment not found", 409);
    }
    res.status(200).json({
      status: "success",
      result: assessment,
    });
  } catch (error) {
    next(error);
  }
};

const saveAssessment = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    const data = req.body;
    console.log("data", data);

    // Trim whitespace from the title
    const trimmedTitle = data.title.trim();

    // Check if the title is already present
    const existingAssessment = await db.Assessment.findOne({
      where: { title: trimmedTitle },
    });

    // Check if the title is already present
    if (existingAssessment) {
      throw createError("Assessment with this title already exists", 409);
    }

    //Step1:Crate assessment
    let assessmentData = {
      title: data.title,
      experience: data.experience,
      designation: data.designation,
      description: data.description,
      totalTopics: data.topics.length,
    };

    if (data.duration !== undefined) {
      assessmentData.duration = data.duration;
    }

    const assessment = await db.Assessment.create(assessmentData, {
      transaction,
    });
    //Step2:Insert the Topics
    for (const topicData of data.topics) {
      const topic = await db.Topic.create(
        {
          name: topicData.name,
          assessmentId: assessment.id,
        },
        { transaction }
      );

      //Step3:Insert the questions
      for (const questionData of topicData.questions) {
        console.log("questionData", questionData);
        const question = await db.Question.create(
          {
            question: questionData.question,
            questionType: questionData.questionType,
            difficultyLevel: questionData.difficultyLevel,
            marks: questionData.marks,
            time: questionData.time,
            topicId: topic.id,
          },
          { transaction }
        );

        //Step4:Insert the questions
        if (
          questionData.questionType === "mcq" ||
          questionData.questionType === "aptitude"
        )
          for (const optionData of questionData.options) {
            await db.Option.create(
              {
                optionText: optionData.optionText,
                isCorrect: optionData.isCorrect,
                questionId: question.id,
              },
              { transaction }
            );
          }
      }
    }
    // Commit the transaction
    const transactionRes = await transaction.commit();
    res.status(200).json({
      status: "success",
      result: transactionRes,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const deleteAssessment = async (req, res, next) => {
  try {
    const assessmentId = req.params.assessmentId;
    const result = await db.Assessment.destroy({
      where: { id: assessmentId },
    });
    if (result === 0) {
      throw createError("Assessment not found", 409);
    }
    res.status(200).json({
      status: "success",
      result: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAssessmentData = async (assessmentId) => {
  try {
    const assessment = await db.Assessment.findOne({
      where: { id: assessmentId },
      include: [
        {
          model: db.Topic,
          include: [
            {
              model: db.Question,
              include: [
                {
                  model: db.Option,
                },
              ],
            },
          ],
        },
      ],
    });
    if (!assessment) {
      throw createError("Assessment not found", 409);
    }
    return assessment;
  } catch (error) {
    throw error;
  }
};

const getAssessmentDetails = async (req, res, next) => {
  try {
    const assessmentId = req.params.assessmentId;
    const assessment = await db.Assessment.findOne({
      where: { id: assessmentId },
    });
    if (!assessment) {
      throw createError("Assessment not found", 409);
    }
    res.status(200).json({
      status: "success",
      result: assessment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssessment,
  getAssessments,
  getAssessment,
  saveAssessment,
  deleteAssessment,
  getAssessmentData,
  getAssessmentDetails,
};
