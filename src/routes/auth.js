const express = require("express");
const {
  register,
  login,
  getProfile,
  logout,
  cookieJwtAuth,
} = require("../controller/auth");
const router = express.Router();
router.post("/login", login);
router.get("/logout", logout);
router.post("/register", register);
router.get("/profile", cookieJwtAuth, getProfile);

module.exports = router;
