const BoardMember = require("../models/boardMember.model");
const memberService = require("../services/member.service");

exports.getMembers = async (req, res) => {
  const { boardId } = req.params;

  try {
    const members = await BoardMember.find({ board: boardId }).populate(
      "user",
      "id username email"
    );

    res.status(200).json(members);
  } catch (error) {
    console.error(`Error fetching members for board ${boardId}:`, error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.inviteMembers = async (req, res) => {
  const { boardId } = req.params;
  const { email, role } = req.body;

  try {
    const newmembership = await memberService.inviteUserByEmail(
      boardId,
      email,
      role
    );
    res.status(201).json(newmembership);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    console.error(`Error inviting members to board ${boardId}:`, error);

    res.status(statusCode).json({
      message: statusCode === 500 ? "Internal server error" : error.message,
      ...(error.membership && { membership: error.membership }),
      error:
        process.env.NODE_ENV === "production" && statusCode === 500
          ? undefined
          : error.message,
    });
  }
};
