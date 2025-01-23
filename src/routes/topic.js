const express = require("express");
const { createTopic,getTopicsForAssessment,getTopic,saveTopics,deleteTopic,updateTopic} = require("../controller/topic");
const { cookieJwtAuth } = require("../controller/auth");
const router = express.Router();
router.post('/', cookieJwtAuth,createTopic);
router.get('/assessment/:assessmentId',cookieJwtAuth, getTopicsForAssessment);
router.get('/:topicId',cookieJwtAuth, getTopic);
router.post('/save', cookieJwtAuth,saveTopics);
router.delete('/:topicId',cookieJwtAuth,deleteTopic)
router.put('/:topicId',cookieJwtAuth,updateTopic)
module.exports = router;
