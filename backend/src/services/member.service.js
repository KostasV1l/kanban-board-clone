const { ROLES } = require("../config/constants");
const BaseService = require("./base.service");
const User = require("../models/user.model");
const BoardMember = require("../models/boardMember.model");
const mongoose = require("mongoose");

class MemberService extends BaseService {
  constructor() {
    super(BoardMember);
  }

  async inviteUserByEmail(boardId, email, role = ROLES.VIEWER) {
    if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
      const error = new Error("Invalid board ID");
      error.statusCode = 400;
      throw error;
    }

    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    if (!Object.values(ROLES).includes(role)) {
      const error = new Error(
        `Invalid role. Valid roles are: ${Object.values(ROLES).join(", ")}`
      );
      error.statusCode = 400;
      throw error;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findOne({ email }).session(session);

      if (!user) {
        const error = new Error("User not found with that email");
        error.statusCode = 404;
        throw error;
      }

      const existingMembership = await this.model
        .findOne({
          user: user._id,
          board: boardId,
        })
        .session(session);

      if (existingMembership) {
        const error = new Error("User is already a member of this board");
        error.statusCode = 409;
        error.membership = {
          id: existingMembership.id,
          email: user.email,
          role: existingMembership.role,
        };
        throw error;
      }

      const newMembershipDoc = new this.model({
        board: boardId,
        user: user._id,
        role,
      });

      await newMembershipDoc.save({ session });

      await session.commitTransaction();

      return await this.model
        .findById(newMembershipDoc._id)
        .populate("user", "id username email");
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = new MemberService();
