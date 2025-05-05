const BoardMember = require("../models/boardMember.model");

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
