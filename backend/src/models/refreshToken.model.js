const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d",
  },
  // Device information
  userAgent: {
    type: String,
    default: "Unknown device",
  },
  ipAddress: {
    type: String,
    default: "Unknown",
  },
  lastUsed: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
