const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createError } = require("../utils/error");
const db = require("../../models");
const register = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    const [user, created] = await db.User.findOrCreate({
      where: { email: req.body.email },
      defaults: req.body,
    });
    user.password = undefined;
    if (!created) {
      throw createError("User already exists", 409);
    }
    res.status(200).json({
      status: "success",
      result: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      throw createError("User not found", 404);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createError("Invalid credentials", 401);
    }

    const jwtToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const cookieJwtAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(500).json({ message: "Session expired" });
      return;
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user) {
      const currentUser = await db.User.findOne({
        where: { id: user.userId },
        attributes: { exclude: ["password"] },
      });
      req.user = currentUser;
    }
    next();
  } catch (error) {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, getProfile, logout, cookieJwtAuth };
