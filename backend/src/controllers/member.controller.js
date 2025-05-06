const BoardMember = require("../models/boardMember.model");
const memberService = require("../services/member.service");


exports.getMembers = async (req, res, next) => {
  const { boardId } = req.params;

  try {
    const members = await BoardMember.find({ board: boardId }).populate(
      "user",
      "id username email"
    );

    res.status(200).json(members);
  } catch (error) {
    return next(error);
  }
};

exports.inviteMembers = async (req, res, next) => {
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
    return next(error);
  }
};

exports.deleteMember = async (req, res, next) => {
  const { memberId, boardId } = req.params;

  try {
    const deletedMember = await memberService.deleteMember(memberId, boardId);
    res.status(200).json(deletedMember);
  } catch (error) {
    return next(error);
  }
};
