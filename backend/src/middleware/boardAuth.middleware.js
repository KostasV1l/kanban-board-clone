const { ROLES, rolePermissions } = require("../config/constants");
const BoardMember = require("../models/boardMember.model");
const mongoose = require("mongoose");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../utils/ApiError");

const checkBoardMembership = (requiredRole) => {
  return async (req, res, next) => {
    const boardId = req.params.boardId || req.body.boardId || req.query.boardId;
    const userId = req.user.id;

    if (!userId) {
      return next(new UnauthorizedError("Authentication required"));
    }

    if (!boardId) {
      return next(new BadRequestError("boardId is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return next(new BadRequestError("Invalid board ID format"));
    }

    try {
      const membership = await BoardMember.findOne({
        board: boardId,
        user: userId,
      }).lean();

      if (!membership) {
        return next(new ForbiddenError("Access denied. You are not a member of this board."));
      }

      const userRole = membership.role;
      const allowedOperationsForRole = rolePermissions[userRole] || [];

      if (!allowedOperationsForRole.includes(requiredRole)) {
        return next(new ForbiddenError(
          `Access denied: Your role ('${userRole}') does not permit '${requiredRole}' operation on this board.`
        ));
      }

      req.boardMember = membership;

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = {
  checkBoardMembership,
};
