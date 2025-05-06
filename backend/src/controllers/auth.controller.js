const authService = require("../services/auth.service");
const RefreshToken = require("../models/refreshToken.model");
const { NotFoundError } = require("../utils/ApiError");

exports.register = async (req, res, next) => {
  try {
    const { user, csrfToken } = await authService.register(req.body, res, req);
    res.status(201).json({
      success: true,
      csrfToken,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, csrfToken } = await authService.login(req.body, res, req);
    res.status(200).json({
      success: true,
      csrfToken,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    return next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { csrfToken } = await authService.refresh(
      req.cookies.refreshToken,
      res,
      req
    );
    res.status(200).json({ success: true, csrfToken });
  } catch (error) {
    return next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const result = await authService.logout(req.cookies.refreshToken);

    res.clearCookie("refreshToken", {
      path: "/api/auth/refresh",
    });
    res.clearCookie("accessToken");
    res.clearCookie("csrf-token");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
      tokenDeleted: result?.success || false,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCurrentUser = (req, res) => {
  const { id, username, email } = req.user;
  res.status(200).json({
    success: true,
    user: { id, username, email },
  });
};


// Get all active sessions for the current user
exports.getUserSessions = async (req, res, next) => {
  try {
    const sessions = await authService.getUserSessions(req.user.id);
    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    return next(error);
  }
};

// Revoke a specific session
exports.revokeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const result = await authService.revokeSession(sessionId, req.user.id);

    if (result.deletedCount === 0) {
      return next(new NotFoundError("Session not found"));
    }

    res.status(200).json({
      success: true,
      message: "Session revoked successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// Revoke all sessions for the current user (except current one)
exports.revokeAllSessions = async (req, res, next) => {
  try {
    const currentRefreshToken = req.cookies.refreshToken;

    await authService.revokeAllSessions(req.user.id, currentRefreshToken);

    res.status(200).json({
      success: true,
      message: "All other sessions revoked successfully", // Updated message for clarity
    });
  } catch (error) {
    return next(error);
  }
};
