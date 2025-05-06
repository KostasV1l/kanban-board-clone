const { ROLES } = require("../config/constants");
const BaseService = require("./base.service");
const User = require("../models/user.model");
const BoardMember = require("../models/boardMember.model");
const mongoose = require("mongoose");
const { 
  BadRequestError, 
  UserNotFoundError, 
  MemberExistsError,
  NotFoundError
} = require("../utils/ApiError");

class MemberService extends BaseService {
  constructor() {
    super(BoardMember);
  }

  async inviteUserByEmail(boardId, email, role = ROLES.VIEWER) {
    if (!boardId) {
      throw new BadRequestError("Board ID is required");
    }

    if (!email) {
      throw new BadRequestError("Email is required");
    }

    if (!Object.values(ROLES).includes(role)) {
      throw new BadRequestError(
        `Invalid role. Valid roles are: ${Object.values(ROLES).join(", ")}`
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findOne({ email }).session(session);

      if (!user) {
        throw new UserNotFoundError("Email doesn't match any registered user");
      }

      const existingMembership = await this.model
        .findOne({
          user: user._id,
          board: boardId,
        })
        .session(session);

      if (existingMembership) {
        const membership = {
          id: existingMembership.id,
          email: user.email,
          role: existingMembership.role,
        };
        throw new MemberExistsError("User is already a member of this board", membership);
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

  async deleteMember(memberId, boardId) {
    if (!memberId || !boardId) {
      throw new BadRequestError("Member ID and Board ID are required");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const membership = await this.model
        .findOne({
          user: memberId,
          board: boardId,
        })
        .session(session);

      if (!membership) {
        throw new NotFoundError("Member not found");
      }

      // Delete the membership
      const result = await this.model
        .findByIdAndDelete(membership._id)
        .session(session);

      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = new MemberService();
