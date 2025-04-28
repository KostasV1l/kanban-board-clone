const BaseService = require("./base.service");
const Board = require("../models/board.model");

class BoardService extends BaseService {
    constructor() {
        super(Board);
    }

    async getBoardsByUser(userId) {
        if (!userId) throw new Error("User ID is required");
        return await this.model.find({ user: userId });
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
