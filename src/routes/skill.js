const express = require("express");
const { createSkill,getSkills} = require("../controller/skill");
const { cookieJwtAuth } = require("../controller/auth");
const router = express.Router();
router.post('/', cookieJwtAuth,createSkill);
router.get('/',cookieJwtAuth, getSkills);

module.exports = router;
