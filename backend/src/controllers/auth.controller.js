const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt.utils");
const authService = require("../services/auth.service");

// @desc    Register user
// @route   POST /api/auth/register
// exports.register = async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = await User.create({
//       username,
//       email,
//       password
//     });

//     sendTokenResponse(user, 201, res);
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Please provide email and password' });
//     }

//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     sendTokenResponse(user, 200, res);
//   } catch (error) {
//     next(error);
//   }
// };

// // Helper function to create token and send response
// const sendTokenResponse = (user, statusCode, res) => {
//   const token = generateToken(user._id);

//   res.status(statusCode).json({
//     success: true,
//     token,
//     user: {
//       id: user._id,
//       username: user.username,
//       email: user.email
//     }
//   });
// };

exports.register = async (req, res, next) => {
  try {
    const { user, crsfToken } = await authService.register(req.body, res);
    res.status(201).json({
      success: true,
      crsfToken,
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
    const { user, crsfToken } = await authService.login(req.body, res);
    res.status(200).json({
      success: true,
      crsfToken,
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
  res.clearCookie("refreshToken");
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
