const mongoose = require("mongoose");
const { baseOptions } = require("./base.model");
const { ROLES } = require("../config/constants");

const BoardMemberSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      default: ROLES.VIEWER,
    },
  },
  baseOptions
);

BoardMemberSchema.index({ board: 1 });
BoardMemberSchema.index({ user: 1 });
BoardMemberSchema.index({ board: 1, user: 1 }, { unique: true });

const BoardMember = mongoose.model("BoardMember", BoardMemberSchema);

module.exports = BoardMember;
