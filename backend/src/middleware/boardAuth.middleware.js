const { ROLES, rolePermissions } = require("../config/constants");
const BoardMember = require("../models/boardMember.model");

const checkBoardMembership = (requiredRole) => {
  return async (req, res, next) => {
    const boardId = req.params.boardId || req.body.boardId || req.query.boardId;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!boardId) {
      return res.status(400).json({ message: "boardId is required" });
    }

    try {
      const membership = await BoardMember.findOne({
        board: boardId,
        user: userId,
      }).lean();

      if (!membership) {
        return res.status(403).json({
          message: "Access denied. You are not a member of this board.",
        });
      }

      const allowedRoles = rolePermissions[membership.role] || [];

      if (!allowedRoles.includes(requiredRole)) {
        return res.status(403).json({
          message: `Access denied: Requires ${requiredRole} role or higher`,
        });
      }

      req.boardMember = membership;

      return next();
    } catch (error) {
      console.error("Error checking board membership:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };
};

module.exports = {
  checkBoardMembership,
};
