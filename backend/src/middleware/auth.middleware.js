const User = require("../models/user.model");
const { verifyAccessToken } = require("../utils/jwt.utils");

exports.protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const crsfToken = req.cookies["x-crsf-token"];

    if (!accessToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (
      !req.path.includes("/refresh") &&
      req.cookies["csrf-token"] !== crsfToken
    ) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }

    const decoded = verifyAccessToken(accessToken);

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authenticated" });
  }
};
