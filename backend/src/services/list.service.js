const BaseService = require("./base.service");
const List = require("../models/list.model");
const Board = require("../models/board.model");
const mongoose = require("mongoose");
const socketEvents = require("../utils/socketEvents");
const { BadRequestError, ListNotFoundError, BoardNotFoundError } = require("../utils/ApiError");

class ListService extends BaseService {
    constructor() {
        super(List);
    }

    async getListsByBoard(boardId) {
        if (!boardId) {
            throw new BadRequestError("Board ID is required");
        }

        const lists = await this.model.find({ board: boardId }).lean();

        const transformedLists = lists.map((list) => {
            const { __v, _id, board, ...restOfList } = list;

            return {
                ...restOfList,
                boardId: board._id.toString(),
                id: list._id.toString(),
            };
        });

        return transformedLists;
    }

    async deleteAllListsByBoard(boardId) {
        if (!boardId) {
            throw new BadRequestError("Board ID is required");
        }
        return await this.model.deleteMany({ board: boardId });
    }

    async getListById(listId) {
        if (!listId) {
            throw new BadRequestError("List ID is required");
        }

        if (!mongoose.Types.ObjectId.isValid(listId)) {
            throw new BadRequestError("Invalid list ID format");
        }

        return await this.model.findById(listId);
    }

    async createList(data) {
        if (!data.board || !data.name) {
            throw new BadRequestError("Board ID and list name are required");
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        let transformedList = null;

        try {
            const [createdListDoc] = await this.model.create([data], { session });

            const board = await Board.findByIdAndUpdate(
                createdListDoc.board,
                { $push: { lists: createdListDoc._id } },
                { session, new: true }
            );

            if (!board) {
                throw new BoardNotFoundError();
            }

            const plainList = createdListDoc.toObject ? createdListDoc.toObject() : createdListDoc;
            const { __v, _id, board: boardId, ...restOfList } = plainList;
            transformedList = {
                ...restOfList,
                id: _id,
                boardId,
            };

            await session.commitTransaction();
        } catch (error) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            throw error;
        } finally {
            session.endSession();
        }

        // On successful creation, emit socket event
        socketEvents.listCreated(data.board, transformedList);

        return transformedList;
    }

    async updateList(listId, data) {
        if (!listId) {
            throw new BadRequestError("List ID is required");
        }

        if (!mongoose.Types.ObjectId.isValid(listId)) {
            throw new BadRequestError("Invalid list ID format");
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const updatedList = await List.findByIdAndUpdate(listId, data, {
                new: true,
                session,
            });

            if (!updatedList) {
                throw new ListNotFoundError();
            }

            await session.commitTransaction();

            // Emit socket event for successful list update
            socketEvents.listUpdated(boardId, listId, updatedList);
            return updatedList;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async deleteList(listId) {
        if (!listId) {
            throw new BadRequestError("List ID is required");
        }

        if (!mongoose.Types.ObjectId.isValid(listId)) {
            throw new BadRequestError("Invalid list ID format");
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        let transformedList = null;

        try {
            const list = await List.findById(listId).session(session);
            if (!list) {
                throw new ListNotFoundError();
            }

            const plainList = list.toObject ? list.toObject() : list;
            const { __v, _id, board, ...restOfList } = plainList;
            transformedList = {
                ...restOfList,
                boardId: board,
            };

            await List.findByIdAndDelete(listId).session(session);
            await Board.findByIdAndUpdate(list.board, { $pull: { lists: list._id } }, { session });

            await session.commitTransaction();

            // Emit socket event for successful list deletion
            socketEvents.listDeleted(list.board, transformedList);
        } catch (error) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            throw error;
        } finally {
            session.endSession();
        }

        return transformedList;
    }

    async reorderLists(boardId, listsIds) {
        if (!boardId || !Array.isArray(listsIds)) {
            throw new BadRequestError("Valid board ID and list IDs array are required");
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const updatedLists = [];

            for (let i = 0; i < listsIds.length; i++) {
                const listId = listsIds[i];
                const updated = await List.findByIdAndUpdate(listId, { order: i }, { new: true, session });

                if (!updated) {
                    throw new ListNotFoundError(`List with ID ${listId} not found`);
                }

                updatedLists.push(updated);
            }

            await session.commitTransaction();

            // Emit socket event for successful list reordering
            socketEvents.listsReordered(boardId, updatedLists);
            return updatedLists;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

module.exports = new ListService();
