const express = require("express");
const {
  getReport,
  getCandidatesForAssessment,
} = require("../controller/report");
const { cookieJwtAuth } = require("../controller/auth");
const router = express.Router();

router.get("/:candidateId/:reportId", cookieJwtAuth, getReport);
router.get("/:assessmentId", cookieJwtAuth, getCandidatesForAssessment);

module.exports = router;
