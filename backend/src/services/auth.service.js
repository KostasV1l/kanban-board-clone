const crypto = require("crypto");
const RefreshToken = require("../models/refreshToken.model");
const User = require("../models/user.model");
const {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
} = require("../utils/jwt.utils");

// Maximum number of refresh tokens per user (sessions/devices)
const MAX_TOKENS_PER_USER = 5;

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict", // means that the cookie is sent only to the same site it originated from
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // path: "/api/auth", // This cookie will only be sent when making requests to '/api/auth' or its subdirectories
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 1 * 60 * 1000, // 15 minutes
  });

  const csrfToken = crypto.randomBytes(32).toString("hex");
  res.cookie("csrf-token", csrfToken, {
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  return csrfToken;
};

const saveRefreshToken = async (token, userId, req = null) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Device identification
  const userAgent = req ? req.headers["user-agent"] : "Unknown device";
  const ipAddress = req ? (req.headers['x-forwarded-for'] || req.connection.remoteAddress) : "Unknown";

  // Check if we need to remove old tokens (limit to MAX_TOKENS_PER_USER)
  const tokenCount = await RefreshToken.countDocuments({ userId });
  if (tokenCount >= MAX_TOKENS_PER_USER) {
    // Get the oldest tokens to remove
    const oldestTokens = await RefreshToken.find({ userId })
      .sort({ lastUsed: 1 })
      .limit(tokenCount - MAX_TOKENS_PER_USER + 1); // +1 to make room for the new token
    
    if (oldestTokens.length > 0) {
      await RefreshToken.deleteMany({ 
        _id: { $in: oldestTokens.map(t => t._id) } 
      });
    }
  }

  // Create the new token
  await RefreshToken.create({
    token,
    expiresAt,
    userId,
    userAgent,
    ipAddress,
    lastUsed: new Date()
  });
};

// Cleanup expired tokens - call this periodically or on startup
exports.cleanupExpiredTokens = async () => {
  const result = await RefreshToken.deleteMany({ expiresAt: { $lt: new Date() } });
  console.log(`Cleaned up ${result.deletedCount} expired refresh tokens`);
  return result.deletedCount;
};

exports.register = async ({ email, password, username }, res, req) => {
  const userExists = await User.findOne({ email });

  if (userExists) throw new Error("USER_EXISTS");

  const user = await User.create({ email, password, username });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await saveRefreshToken(refreshToken, user._id, req);

  const csrfToken = setTokenCookies(res, accessToken, refreshToken);

  return { user, csrfToken };
};

exports.login = async ({ email, password }, res, req) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await saveRefreshToken(refreshToken, user._id, req);

  const csrfToken = setTokenCookies(res, accessToken, refreshToken);

  return { user, csrfToken };
};

exports.refresh = async (refreshTokenCookie, res, req) => {
  if (!refreshTokenCookie) throw new Error("NO_REFRESH_TOKEN");

  // Find the token and update its lastUsed time
  const saved = await RefreshToken.findOne({ token: refreshTokenCookie });
  if (!saved) throw new Error("BAD_REFRESH_TOKEN");

  const decoded = verifyRefreshToken(refreshTokenCookie);

  // Implement token rotation - delete the old one
  await RefreshToken.deleteOne({ token: refreshTokenCookie });

  const newAccessToken = generateAccessToken(decoded.id);
  const newRefreshToken = generateRefreshToken(decoded.id);

  // Create new refresh token with same device info
  await RefreshToken.create({
    token: newRefreshToken,
    userId: decoded.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: saved.userAgent,
    ipAddress: req ? (req.headers['x-forwarded-for'] || req.connection.remoteAddress) : saved.ipAddress,
    lastUsed: new Date()
  });

  const csrfToken = setTokenCookies(res, newAccessToken, newRefreshToken);

  return { csrfToken };
};

exports.logout = async (refreshTokenCookie) => {
  try {
    console.log("Logout called with token:", refreshTokenCookie ? "Token exists" : "No token provided");
    
    if (!refreshTokenCookie) {
      console.log("No refresh token provided for logout");
      return { success: false, reason: "NO_TOKEN" };
    }
    
    // Find the token first to verify it exists
    const tokenDoc = await RefreshToken.findOne({ token: refreshTokenCookie });
    console.log("Token found in database:", tokenDoc ? "Yes" : "No");
    
    if (!tokenDoc) {
      console.log("Token not found in database");
      return { success: false, reason: "TOKEN_NOT_FOUND" };
    }
    
    // Delete the token
    const result = await RefreshToken.deleteOne({ token: refreshTokenCookie });
    console.log("Delete result:", result);
    
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    console.error("Error during logout:", error);
    return { success: false, error: error.message };
  }
};

// New function to list user's active sessions
exports.getUserSessions = async (userId) => {
  const sessions = await RefreshToken.find({ userId })
    .select('userAgent ipAddress createdAt lastUsed')
    .sort({ lastUsed: -1 });
  
  return sessions;
};

// New function to revoke a specific session
exports.revokeSession = async (sessionId, userId) => {
  return await RefreshToken.deleteOne({ _id: sessionId, userId });
};

// New function to revoke all sessions for a user (for password change, etc.)
exports.revokeAllSessions = async (userId) => {
  return await RefreshToken.deleteMany({ userId });
};
