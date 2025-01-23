const express = require("express");
const { createOption,getOptionsForQuestion,getOption} = require("../controller/option");
const { cookieJwtAuth } = require("../controller/auth");
const router = express.Router();
router.post('/', cookieJwtAuth,createOption);
router.get('/question/:questionId',cookieJwtAuth, getOptionsForQuestion);
router.get('/:optionId',cookieJwtAuth, getOption);
module.exports = router;
