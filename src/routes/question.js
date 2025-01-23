const express = require("express");
const { cookieJwtAuth} = require("../controller/auth");
const { createQuestion,getQuestiosForAssessment,getQuestion} = require("../controller/question");
const router = express.Router();
router.post('/',cookieJwtAuth, createQuestion);
router.get('/topic/:topicId', cookieJwtAuth,getQuestiosForAssessment);
router.get('/:questionId',cookieJwtAuth, getQuestion);

module.exports = router;
