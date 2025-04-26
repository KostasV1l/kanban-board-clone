// services/board.service.js
const BaseService = require("./base.service");
const Board = require("../models/board.model");

class BoardService extends BaseService {
    constructor() {
        super(Board);
    }

    /** Create a new board; returns a plain JS object with `id` */
    async create(data) {
        const boardDoc = await super.create(data);
        return boardDoc.toJSON();
    }

    /** Find by ID; returns `null` or plain JS object */
    async findById(id) {
        const boardDoc = await super.findById(id);
        return boardDoc ? boardDoc.toJSON() : null;
    }

    /** Update by ID; returns updated plain JS object or `null` */
    async update(id, data) {
        const boardDoc = await super.update(id, data);
        return boardDoc ? boardDoc.toJSON() : null;
    }

    /**
     * List boards by owner (userId or guestId)
     * @param {{ userId?: string, guestId?: string, limit?: number, skip?: number, projection?: object }} opts
     */
    async findByOwner({ userId, guestId, limit = 50, skip = 0, projection = {} }) {
        if (!userId && !guestId) {
            throw new Error("Either userId or guestId is required");
        }
        const filter = userId ? { user: userId } : { guestId };
        const docs = await this.model.find(filter, projection).sort({ createdAt: -1 }).skip(skip).limit(limit);

        return docs.map((doc) => doc.toJSON());
    }

    /**
     * Bulk delete by owner
     * @param {{ userId?: string, guestId?: string }} opts
     */
    async deleteAllByOwner({ userId, guestId }) {
        if (!userId && !guestId) {
            throw new Error("Either userId or guestId is required");
        }
        const filter = userId ? { user: userId } : { guestId };
        return this.model.deleteMany(filter);
    }
}

module.exports = new BoardService();
