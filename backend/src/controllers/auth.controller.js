const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt.utils");
const authService = require("../services/auth.service");
const RefreshToken = require("../models/refreshToken.model");

exports.register = async (req, res, next) => {
  try {
    const { user, csrfToken } = await authService.register(req.body, res, req);
    res.status(201).json({
      success: true,
      csrfToken,
      user: { id: user.id, username: user.username, email: user.email },
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
    const { user, csrfToken } = await authService.login(req.body, res, req);
    res.status(200).json({
      success: true,
      csrfToken,
      user: { id: user.id, username: user.username, email: user.email },
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
      res,
      req
    );
    res.status(200).json({ success: true, csrfToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

exports.logout = async (req, res) => {
  console.log("Logout endpoint called, refresh token exists:", !!req.cookies.refreshToken);
  
  const result = await authService.logout(req.cookies.refreshToken);
  console.log("Logout service result:", result);

  res.clearCookie("refreshToken", {
    path: "/api/auth/refresh",
  });
  res.clearCookie("accessToken");
  res.clearCookie("csrf-token");

  res.status(200).json({ 
    success: true, 
    message: "Logged out successfully",
    tokenDeleted: result?.success || false 
  });
};
exports.getCurrentUser = (req, res) => {
  const { id, username, email } = req.user;
  res.status(200).json({
    success: true,
    user: { id, username, email },
  });
};

// New endpoints for session management

// Get all active sessions for the current user
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await authService.getUserSessions(req.user.id);
    res.status(200).json({
      success: true,
      sessions
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve sessions" });
  }
};

// Revoke a specific session
exports.revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await authService.revokeSession(sessionId, req.user.id);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Session not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Session revoked successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to revoke session" });
  }
};

// Revoke all sessions for the current user (except current one)
exports.revokeAllSessions = async (req, res) => {
  try {
    // Keep the current session active
    const currentRefreshToken = req.cookies.refreshToken;
    let currentSession = null;
    
    if (currentRefreshToken) {
      currentSession = await RefreshToken.findOne({ token: currentRefreshToken });
    }
    
    // Delete all other sessions
    await authService.revokeAllSessions(req.user.id);
    
    // Re-save the current session if needed
    if (currentSession) {
      await currentSession.save();
    }
    
    res.status(200).json({
      success: true,
      message: "All sessions revoked except current one"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to revoke all sessions" });
  }
};
