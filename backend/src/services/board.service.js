const BaseService = require("./base.service");
const Board = require("../models/board.model");
const Task = require("../models/task.model");

class BoardService extends BaseService {
  constructor() {
    super(Board);
  }

  async getBoardsWithTaskCounts(query) {
    const boards = await this.model.find(query);

    // Get task counts for each board
    const boardsWithCounts = await Promise.all(
      boards.map(async (board) => {
        const tasksCount = await Task.countDocuments({ board: board._id });
        return {
          ...board.toObject(),
          tasksCount,
        };
      })
    );

    return boardsWithCounts;
  }

  async getBoardsByUser(userId) {
    if (!userId) throw new Error("User ID is required");
    console.log("userId", userId);
    return await this.getBoardsWithTaskCounts({ user: userId });
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
