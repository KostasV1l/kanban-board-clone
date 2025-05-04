const BaseService = require("./base.service");
const Board = require("../models/board.model");
const Task = require("../models/task.model");
const BoardMember = require("../models/boardMember.model");
const List = require("../models/list.model");

class BoardService extends BaseService {
  constructor() {
    super(Board);
  }

  async getBoardsByUser(userId, role = null) {
    try {
      const query = { user: userId };
      if (role) {
        query.role = role;
      }

      console.log("query", query);

      const memberships = await BoardMember.find(query).lean();

      const boardIds = memberships.map((member) => member.board);

      if (boardIds.length === 0) {
        return [];
      }

      const boards = await this.model.find({ _id: { $in: boardIds } }).lean();

      const boardRoleMap = {};

      memberships.forEach((membership) => {
        boardRoleMap[membership.board.toString()] = membership.role;
      });

      const boardsWithDetails = await Promise.all(
        boards.map(async (board) => {
          const lists = await List.find({ board: board._id }).lean();

          const listIds = lists.map((list) => list._id);

          const tasksCount = await Task.countDocuments({
            list: { $in: listIds },
          });

          const { _id, ...boardData } = board;
          return {
            ...boardData,
            id: _id.toString(),
            userRole: boardRoleMap[board._id],
            tasksCount,
          };
        })
      );

      console.log("boardsWithDetails", boardsWithDetails);

      return boardsWithDetails;
    } catch (error) {
      console.error("Error fetching boards by user:", error);
      throw error;
    }
  }

  async getBoardsByGuest(guestId) {
    if (!guestId) throw new Error("Guest ID is required");
    return await this.model.find({ guestId });
  }

  async deleteAllBoardsByUser(userId) {
    if (!userId) throw new Error("User ID is required");
    return await this.model.deleteMany({ user: userId });
  }

  async deleteAllBoardsByGuest(guestId) {
    if (!guestId) throw new Error("Guest ID is required");
    return await this.model.deleteMany({ guestId });
  }
}

module.exports = new BoardService();
