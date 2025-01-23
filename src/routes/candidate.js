const express = require("express");
const {
    createCandidate,
    generateTest,
    getTest,
    deleteCandidate,
    handleCandidateCookie,
    submitTest
} = require("../controller/candidate");
const { cookieJwtAuth } = require("../controller/auth");
const router = express.Router();
router.post("/", createCandidate);
router.post('/generate-test/:assessmentId', generateTest)
router.get('/get-test',handleCandidateCookie, getTest)
router.delete('/:candidateId', cookieJwtAuth, deleteCandidate)
router.post('/submit-test',handleCandidateCookie, submitTest)

module.exports = router;
