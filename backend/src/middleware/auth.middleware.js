const logger = require("../config/logger");
const User = require("../models/user.model");
const { verifyAccessToken } = require("../utils/jwt.utils");
const { UnauthorizedError, CSRFError } = require("../utils/ApiError");

exports.protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const csrfTokenHeader = req.headers["x-csrf-token"];
    const csrfTokenCookie = req.cookies["csrf-token"];

    if (!accessToken) {
      return next(new UnauthorizedError("Not authenticated"));
    }

    if (
      !req.path.includes("/refresh") &&
      (!csrfTokenHeader || !csrfTokenCookie || csrfTokenHeader !== csrfTokenCookie)
    ) {
      return next(new CSRFError("Invalid CSRF token"));
    }

    const decoded = verifyAccessToken(accessToken);

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new UnauthorizedError("User not found"));
    }
    
    next();
  } catch (err) {
    return next(new UnauthorizedError("Not authenticated"));
  }
};


