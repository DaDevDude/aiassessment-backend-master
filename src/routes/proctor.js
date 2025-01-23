const express = require("express");
const { updateProctor, updateVideoUri} = require("../controller/proctor");
const { handleCandidateCookie } = require("../controller/candidate");
const router = express.Router();
router.put('/', handleCandidateCookie,updateProctor);
router.put('/submit-videouri/', updateVideoUri);
module.exports = router;
