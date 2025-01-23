const { createError } = require("../utils/error");
const { getAssessmentData } = require("./assessment");
const db = require("../../models");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const { Op } = require("sequelize");
const createCandidate = async (req, res, next) => {
  try {
    const [candidate, created] = await db.Candidate.findOrCreate({
      where: { email: req.body.email },
      defaults: req.body,
    });
    if (!created) {
      throw createError(
        "Candidate already appeared for one test.Can't give another test",
        409
      );
    }
    res.status(200).json({
      status: "success",
      result: candidate,
    });
  } catch (error) {
    next(error);
  }
};

const generateRandomQuestions = async (assessmentId) => {
  try {
    let assessment = await getAssessmentData(assessmentId);
    let questions = [];
    assessment.Topics.forEach((topic) => {
      topic = topic.get({ plain: true });
      //NOTE: Here selecting any random 1 questions from each topic
      const shuffledQuestions = topic.Questions.slice().sort(
        () => 0.5 - Math.random()
      );
      let Questions = shuffledQuestions.slice(0, 1); // TODO:Change it to 1 while pushing

      //NOTE: Here removing isCorrect(correct answer) from the options
      Questions = Questions.forEach((question) => {
        if (question.Options && question.Options.length) {
          question.Options = question.Options.map((option) => ({
            id: option.id,
            optionText: option.optionText,
          }));
        }
        questions.push(question);
      });
    });
    return questions;
  } catch (error) {
    throw error;
  }
};

const setCookie = (candidateId, reportId, proctorId, res) => {
  try {
    const jwtToken = jwt.sign(
      {
        candidateId,
        reportId,
        proctorId,
      },
      process.env.JWT_SECRET
    );

    res.cookie("candidateToken", jwtToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60,
    });
  } catch (error) {
    throw error;
  }
};

const generateTest = async (req, res, next) => {
  try {
    /*
      NOTE:
      1.Create candidate 
      2.Create proctor 
      3.Create report and attach proctor
      4.Generate random 1 questions from each topic and create those many answers
      5.Attach the candidateId,reportId,proctorId to the cookies
      6.Send the report Id along with proctoring data
      */
    const assessmentId = req.params.assessmentId;

    const assessmentExists = await db.Assessment.findOne({
      where: { id: assessmentId },
    });
    if (!assessmentExists) {
      throw createError("Assessment does not exists", 404);
    }
    const transaction = await db.sequelize.transaction();

    // Step1: Create candidate
    const [candidate, candidateCreated] = await db.Candidate.findOrCreate({
      where: { email: req.body.email },
      defaults: req.body,
      transaction,
    });
    const reportPresent = await db.Report.findOne({
      where: { assessmentId, candidateId: candidate.id },
    });
    if (reportPresent) {
      throw createError("Candidate has already given this test.", 409);
    }

    // Step2: Create proctor with default values
    const proctorData = await db.Proctor.create({}, { transaction });

    // Step3:Create report and attach proctor
    let report = await db.Report.create(
      {
        candidateId: candidate.id,
        assessmentId,
        proctorId: proctorData.id,
      },
      { transaction }
    );

    // Step4: Generate random 1 questions from each topic and create those many answers
    const questions = await generateRandomQuestions(assessmentId);
    const answers = [];
    for (const question of questions) {
      let answer = await db.Answer.create(
        {
          reportId: report.id,
          questionId: question.id,
        },
        { transaction }
      );
      answer = answer.get({ plain: true });
      answers.push({
        id: answer.id,
        selectedOptionId: answer.selectedOptionId,
        markedForReview: answer.markedForReview,
        providedAnswer: answer.providedAnswer,
        Question: {
          id: question.id,
          question: question.question,
          Options: question.Options,
          difficultyLevel: question.difficultyLevel,
          questionType: question.questionType,
        },
      });
    }
    const transactionRes = await transaction.commit();

    report = report.get({ plain: true });

    //Step5: Attach the candidateId,reportId,proctorId to the cookies
    //Step6: Send the report Id along with proctoring data
    setCookie(candidate.id, report.id, proctorData.id, res);
    res.status(200).json({
      status: "success",
      report: {
        ...report,
        proctor: proctorData,
        answers,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTest = async (req, res, next) => {
  try {
    const candidateId = req.candidate.candidateId;
    const reportId = req.candidate.reportId;
    const report = await db.Report.findOne({
      where: { id: reportId, candidateId: candidateId },
      include: [
        {
          model: db.Answer,
          as: "answers",
          attributes: [
            "id",
            "selectedOptionId",
            "markedForReview",
            "providedAnswer",
          ],
          include: [
            {
              model: db.Question,
              attributes: ["id", "question", "difficultyLevel", "questionType"],
              include: [
                {
                  model: db.Option,
                  attributes: ["id", "optionText"],
                },
              ],
            },
          ],
        },
        {
          model: db.Proctor,
          as: "proctor",
        },
      ],
    });
    if (!report) {
      throw createError("Test not found", 409);
    }
    res.status(200).json({
      status: "success",
      report,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCandidate = async (req, res, next) => {
  try {
    const candidateId = req.params.candidateId;
    const report = await db.Report.findOne({ where: { candidateId } });
    const result = await db.Candidate.destroy({
      where: { id: candidateId },
    });
    if (result === 0) {
      throw createError("Candidate not found", 409);
    }
    //Delete the proctor
    await db.Proctor.destroy({ where: { id: report.proctorId } });

    res.status(200).json({
      status: "success",
      result: result,
    });
  } catch (error) {
    next(error);
  }
};

const handleCandidateCookie = async (req, res, next) => {
  try {
    const token = req.cookies.candidateToken;
    if (!token) {
      res.status(500).json({ message: "Session expired" });
      return;
    }
    const candidate = jwt.verify(token, process.env.JWT_SECRET);
    if (candidate) {
      req.candidate = {
        candidateId: candidate.candidateId,
        reportId: candidate.reportId,
        proctorId: candidate.proctorId,
      };
      next();
    } else {
      throw new Error("Candidate did not verify");
    }
  } catch (error) {
    res.clearCookie("candidateToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    next(error);
  }
};

// Helper function to handle retries[In some cases gpt fails to send response]
async function retryRequest(fn, retries = 2) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      // console.log(`Retrying request, attempts left: ${retries}`);
      return retryRequest(fn, retries - 1);
    } else {
      throw error;
    }
  }
}

async function sendRequestToValidateAnswer(subjectiveAnswers) {
  try {
    const responses = await Promise.all(
      subjectiveAnswers.map(async (answer) => {
        return retryRequest(async () => {
          const apiResponse = await axios.post(
            process.env.ML_SERVER_URL + "/api/gpt/validate-answers",
            {
              question: answer.Question.question,
              answer: answer.providedAnswer,
              marks_out_of: 100,
              id: answer.id, // to be removed from ml and from this
            }
          );
          return (
            apiResponse.data && { ...apiResponse.data, answerId: answer.id }
          );
        });
      })
    );
    return responses;
  } catch (error) {
    throw error;
  }
}

//TODO:Remove the condition( eachScore.score > 70 ) when marks system added
async function updateScores(scores) {
  try {
    const responses = await Promise.all(
      scores.map(async (eachScore) => {
        let res = await db.Answer.update(
          { isCorrect: eachScore.score > 70 },
          { where: { id: eachScore.answerId } }
        );
        return res;
      })
    );
    return responses;
  } catch (error) {
    throw error;
  }
}

const validateAnswersSubjective = async (req) => {
  try {
    const reportId = req.candidate.reportId;
    let answers = await db.Answer.findAll({
      where: {
        reportId,
        providedAnswer: {
          [Op.ne]: "",
        },
      },
      include: {
        model: db.Question,
        where: {
          questionType: "subjective",
        },
      },
    });
    const scores = await sendRequestToValidateAnswer(answers);
    const result = await updateScores(scores);
    return result;
  } catch (error) {
    throw error;
  }
};

const validateAnswersObjective = async (reportId) => {
  try {
    //Validate and save the answer
    let objectiveAnswers = await db.Answer.findAll({
      where: {
        reportId,
      },
      include: {
        model: db.Question,
        where: {
          questionType: "mcq",
        },
        include: {
          model: db.Option,
        },
      },
    });

    const responses = await Promise.all(
      objectiveAnswers.map(async (answer) => {
        if (answer.Question.questionType === "mcq" && answer.selectedOptionId) {
          if (
            answer.Question.Options.find((option) => option.isCorrect).id ===
            answer.selectedOptionId
          ) {
            return await db.Answer.update(
              { isCorrect: true },
              { where: { id: answer.id } }
            );
          }
        }
      })
    );
    return responses;
  } catch (error) {
    throw error;
  }
};

const submitTest = async (req, res, next) => {
  try {
    const reportId = req.candidate.reportId;
    // const {status} = req.body;
    await validateAnswersObjective(reportId);
    await validateAnswersSubjective(req);
    let result = await db.Report.update(
      { status: "completed", submittedAt: new Date() },
      { where: { id: reportId } }
    );
    if (result && result[0] === 0) {
      throw createError("Report with given id does not exists", 404);
    }
    const updatedReport = await db.Report.findOne({
      where: {
        id: reportId,
      },
    });
    res.clearCookie("candidateToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    }); //TODO: Uncomment while pushing
    res.status(200).json({
      status: "success",
      result: updatedReport,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createCandidate,
  generateTest,
  getTest,
  deleteCandidate,
  handleCandidateCookie,
  submitTest,
};
