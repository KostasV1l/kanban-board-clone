const express = require("express");
const { register, login, refreshToken, logout, getCurrentUser } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);

module.exports = router;
