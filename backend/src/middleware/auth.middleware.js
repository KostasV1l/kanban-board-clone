const User = require("../models/user.model");
const { verifyAccessToken } = require("../utils/jwt.utils");

exports.protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const csrfTokenHeader = req.headers["x-csrf-token"];
    const csrfTokenCookie = req.cookies["csrf-token"];


    if (!accessToken) {
      console.log("Authentication failed: No access token");
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (
      !req.path.includes("/refresh") &&
      ( !csrfTokenHeader || !csrfTokenCookie || csrfTokenHeader !== csrfTokenCookie )
    ) {
      console.log("Authentication failed: CSRF validation failed");
      return res.status(403).json({ message: "Invalid CSRF token" });
    }

    const decoded = verifyAccessToken(accessToken);

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      console.log("Authentication failed: User not found");
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    console.log("Authentication error:", err);
    return res.status(401).json({ message: "Not authenticated" });
  }
};
