const { Op } = require('sequelize');
const db = require('../../models')
const _ = require('lodash');
const { createError } = require('../utils/error');

const getTestSummary = (report) => {
  try {
    const countByIsCorrect = _.countBy(report.answers, "isCorrect");
    const falseCount = countByIsCorrect[false] || 0;
    let totalAnswers = report.answers.length;
    let correctAnswers = totalAnswers - falseCount;

    let testSummary = {
      totalQuestions: totalAnswers,
      correctAnswers,
      incorrectAnswers: falseCount,
      percentage: parseFloat(((correctAnswers / totalAnswers) * 100).toFixed(2)),
    };

    return testSummary;
  } catch (error) {
    throw error;
  }
};
const getReport = async (req,res,next) => {
    try {
      const candidateId = req.params.candidateId;
      const reportId = req.params.reportId;
      
      let report = await db.Report.findOne({
        where: { id: reportId, candidateId: candidateId},
        include: [
          {
            model: db.Answer,
            as:'answers',
            include: [
              {
                model: db.Question,
                include: [
                  {
                    model: db.Option,
                    attributes: ['id', 'optionText','isCorrect']
                  },
                  {
                    model: db.Topic,
                    attributes: ['id', 'name']
                  }
                ]
              }
            ]
          },
          {
            model: db.Proctor,
            as:'proctor'
          },
          {
            model: db.Candidate,
            as:'candidate'
          }
        ]
      });
      if (!report) {
        throw createError('Report not found',409)
      }
      report = report.get({ plain: true });

      // test summary
      report.testSummary = getTestSummary(report)
      // test summary logic ends --------------------------------------
      
      //TODO: Using topics for skills overview later usin skill
      //skills overview  
      const skillSections = {
        good: [],
        bad: []
      };
      
      const skillCounts = {};
      
      report.answers.forEach((answer) => {
        const skill = answer.Question.Topic.name; // using skill when skill section is implemented
        const section = answer.isCorrect ? 'good' : 'bad';
        if (!skillCounts[skill]) {
          skillCounts[skill] = { good: 0, bad: 0 };
        }
        skillCounts[skill][section]++;
      });
      Object.keys(skillCounts).forEach(skill => {
        const { good, bad } = skillCounts[skill];
      
        if (good > bad) {
          skillSections.good.push(skill);
        } else if (bad > good) {
          skillSections.bad.push(skill);
        }
      });
      report.skillSections = skillSections
      console.log("report", report);
      //skills overview ends --------------------------------------

   
      res.status(200).json({
        status: "success",
        report,
      });
    } catch (error) {
      next(error);
    }
  }

  const getTimeTaken = (submittedDate, createdDate) => {
    try {
      const submittedAt = new Date(submittedDate);
      const createdAt = new Date(createdDate);

      return submittedAt - createdAt;
    } catch (error) {
      throw error;
    }
  };
const getCandidatesForAssessment = async (req,res,next) =>{
  try {
    const assessmentId = req.params.assessmentId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20
    const sortOrder = req.query.sortOrder || 'DESC';
    const sortBy = req.query.sortBy || 'submittedAt';
    const searchBy = req.query.searchBy || '';
    const offset = (page - 1)* limit;

      let {count,rows} = await db.Report.findAndCountAll({
        where: { assessmentId: assessmentId },
        include: [
          {
            model: db.Candidate,
            as:'candidate',
            where:{
              [Op.or]: [
                { name: { [Op.iLike]: `%${searchBy}%` } },
                { email: { [Op.iLike]: `%${searchBy}%` } }
              ]
            },
            required: true
          }
        ],
        limit,
        offset,
        order: [['submittedAt',sortOrder]],
      }); // Reports will always be sort on the submittedAt 

      if (!rows.length) {
        throw createError('Candidates not found for this assessment',409)
      }

      //Getting all answers for each report and calculating percentage
      rows = await Promise.all(
        rows.map(async (eachRow) => {
          eachRow = eachRow.get({ plain: true });
          let answers = await db.Answer.findAll({
            where: { reportId: eachRow.id },
          });
          eachRow.answers = answers;
          let testSummary = getTestSummary(eachRow);
          delete eachRow.answers;
          eachRow.percentage = testSummary.percentage;
          eachRow.timeTaken = eachRow.submittedAt && eachRow.createdAt ? getTimeTaken(eachRow.submittedAt,eachRow.createdAt) : null;
          return eachRow;
        })
      ); 

      // Sorting for the other values which are by default not in the report
      if (
        sortBy === "name" ||
        sortBy === "email" ||
        sortBy === "percentage" ||
        sortBy === "timeTaken"
      ) {
        let iteratee;
        if (sortBy === "name" || sortBy === "email") {
          iteratee = `candidate.${sortBy}`;
        } else {
          iteratee = sortBy;
        }
        rows = _.orderBy(rows, [iteratee], [sortOrder.toLowerCase()]);
      }

     res.status(200).json({
        status: "success",
        result: {
          reports:rows,
          totalItems:count,
          totalPages:Math.ceil(count/limit),
          currentPage:page
        },
      });

  } catch (error) {
    next(error)
  }
}
module.exports = {getReport,getCandidatesForAssessment}