const BaseService = require("./base.service");
const Board = require("../models/board.model");

class BoardService extends BaseService {
    constructor() {
        super(Board);
    }

    // Get boards by user ID
    async getBoardsByUser(userId) {
        try {
            // Check if userId is defined
            if (!userId) {
                throw new Error("User ID is required");
            }
            return await this.model.find({ user: userId });
        } catch (error) {
            throw error;
        }
    }

    // Get boards by guest ID
    async getBoardsByGuest(guestId) {
        try {
            // Check if guestId is defined
            if (!guestId) {
                throw new Error("Guest ID is required");
            }
            return await this.model.find({ guestId });
        } catch (error) {
            throw error;
        }
    }

    // Delete all boards by user ID
    async deleteAllBoardsByUser(userId) {
        try {
            // Check if userId is defined
            if (!userId) {
                throw new Error("User ID is required");
            }
            return await this.model.deleteMany({ user: userId });
        } catch (error) {
            throw error;
        }
    }

    // Delete all boards by guest ID
    async deleteAllBoardsByGuest(guestId) {
        try {
            // Check if guestId is defined
            if (!guestId) {
                throw new Error("Guest ID is required");
            }
            return await this.model.deleteMany({ guestId });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BoardService();
