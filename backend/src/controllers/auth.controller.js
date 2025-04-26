const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt.utils");
const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const { user, csrfToken } = await authService.register(req.body, res);
    res.status(201).json({
      success: true,
      csrfToken,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    if (error.message === "USER_EXISTS") {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { user, csrfToken } = await authService.login(req.body, res);
    res.status(200).json({
      success: true,
      csrfToken,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    const code = err.message === "INVALID_CREDENTIALS" ? 401 : 500;
    res.status(code).json({
      message: "Invalid Credentials",
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { csrfToken } = await authService.refresh(
      req.cookies.refreshToken,
      res
    );
    res.status(200).json({ success: true, csrfToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

exports.logout = async (req, res) => {
  await authService.logout(req.cookies.refreshToken);

  res.clearCookie("refreshToken", {
    path: "/api/auth/refresh",
  });
  res.clearCookie("accessToken");
  res.clearCookie("csrfToken");

  res.status(200).json({ success: true, message: "Logged out successfully" });
};
exports.getCurrentUser = (req, res) => {
  const { _id, username, email } = req.user;
  res.status(200).json({
    success: true,
    user: { id: _id, username, email },
  });
};
