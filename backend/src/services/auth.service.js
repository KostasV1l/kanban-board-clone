const crypto = require("crypto");
const RefreshToken = require("../models/refreshToken.model");
const User = require("../models/user.model");
const {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
} = require("../utils/jwt.utils");

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict", // means that the cookie is sent only to the same site it originated from
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh", // This cookie will only be sent when making requests to '/api/auth/refresh' or its subdirectories
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  const crsfToken = crypto.randomBytes(32).toString("hex");
  res.cookie("crsfToken", crsfToken, {
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  return crsfToken;
};

const saveRefreshToken = async (token, userId) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token,
    expiresAt,
    userId,
  });
};

exports.register = async ({ email, password, username }, res) => {
  const userExists = await User.findOne({ email });

  if (userExists) throw new Error("USER_EXISTS");

  const user = await User.create({ email, password, username });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await saveRefreshToken(refreshToken, user._id);

  const crsfToken = setTokenCookies(res, accessToken, refreshToken);

  return { user, crsfToken };
};

exports.login = async ({ email, password }, res) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await saveRefreshToken(refreshToken, user._id);

  const crsfToken = setTokenCookies(res, accessToken, refreshToken);

  return { user, crsfToken };
};

exports.refresh = async (refreshTokenCookie, res) => {
  if (!refreshTokenCookie) throw new Error("NO_REFRESH_TOKEN");

  const saved = await RefreshToken.findOne({ token: refreshTokenCookie });
  if (!saved) throw new Error("BAD_REFRESH_TOKEN");

  const decoded = verifyRefreshToken(refreshTokenCookie);

  await RefreshToken.deleteOne({ token: refreshTokenCookie });

  const newAccessToken = generateAccessToken(decoded.id);
  const newRefreshToken = generateRefreshToken(decoded.id);

  await saveRefreshToken(newRefreshToken, decoded.id);

  const crsfToken = setTokenCookies(res, newAccessToken, newRefreshToken);

  return { crsfToken };
};

exports.logout = async (refreshTokenCookie) => {
  if (refreshTokenCookie) {
    await RefreshToken.deleteOne({ token: refreshTokenCookie });
  }
};
