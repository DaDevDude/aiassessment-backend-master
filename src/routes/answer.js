const express = require("express");
const { saveAnswer } = require("../controller/answer");
const { handleCandidateCookie } = require("../controller/candidate");

const router = express.Router();


router.put('/:answerId', handleCandidateCookie, saveAnswer)


module.exports = router;
