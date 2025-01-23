const express = require("express");
const { cookieJwtAuth } = require("../controller/auth");
const {
  createAssessment,
  saveAssessment,
  getAssessments,
  getAssessment,
  deleteAssessment,
  getAssessmentDetails,
} = require("../controller/assessment");
const router = express.Router();
router.post("/", cookieJwtAuth, createAssessment);
router.post("/save", cookieJwtAuth, saveAssessment);
router.get("/", cookieJwtAuth, getAssessments);
router.get("/:assessmentId", cookieJwtAuth, getAssessment);
router.delete("/:assessmentId", cookieJwtAuth, deleteAssessment);
router.get("/details/:assessmentId", cookieJwtAuth, getAssessmentDetails);
module.exports = router;
