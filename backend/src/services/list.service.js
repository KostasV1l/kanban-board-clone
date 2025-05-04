const BaseService = require("./base.service");
const List = require("../models/list.model");
const Board = require("../models/board.model");
const mongoose = require("mongoose");

class ListService extends BaseService {
  constructor() {
    super(List);
  }

  async getListsByBoard(boardId) {
    if (!boardId) throw new Error("Board ID is required");
    console.log("boardId", boardId);

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
    if (!boardId) throw new Error("Board ID is required");
    return await this.model.deleteMany({ board: boardId });
  }

  async getListById(listId) {
    if (!listId) throw new Error("List ID is required");
    return await this.model.findById(listId);
  }

  async createList(data) {
    const session = await mongoose.startSession();
    session.startTransaction();

    let transformedList = null;

    try {
      const [createdListDoc] = await this.model.create([data], { session });

      await Board.findByIdAndUpdate(
        createdListDoc.board,
        { $push: { lists: createdListDoc._id } },
        { session, new: true }
      );

      const plainList = createdListDoc.toObject ? createdListDoc.toObject() : createdListDoc;
      const { __v, _id, board, ...restOfList } = plainList;
      transformedList = {
          ...restOfList,
          id: _id,
          boardId: board
      };

      await session.commitTransaction();

    } catch (error) {
      if (session.inTransaction()) {
          await session.abortTransaction();
      }
      console.error("Error during createList transaction:", error);
      throw error;
    } finally {
      session.endSession();
    }


    return transformedList;
}

  async updateList(listId, data) {
    if (!listId) throw new Error("list Id is required");

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const updatedList = await List.findByIdAndUpdate(listId, data, {
        new: true,
        session,
      });

      if (!updatedList) throw new Error("List not found");

      await session.commitTransaction();
      return updatedList;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async deleteList(listId) {
    if (!listId) throw new Error("List ID is required");

    const session = await mongoose.startSession();
    session.startTransaction();

    let transformedList = null;

    try {
      const list = await List.findById(listId).session(session);
      if (!list) {
         await session.abortTransaction();
         session.endSession();
         throw new Error("List not found");
      }

      const plainList = list.toObject ? list.toObject() : list;
      const { __v, _id, board, ...restOfList } = plainList;
      transformedList = {
          ...restOfList,
          boardId: board,
      };

      await List.findByIdAndDelete(listId).session(session);
      await Board.findByIdAndUpdate(
        list.board,
        { $pull: { lists: list._id } },
        { session }
      );

      await session.commitTransaction();

    } catch (error) {
      if (session.inTransaction()) {
          await session.abortTransaction();
      }
      console.error("Error during deleteList transaction:", error);
      throw error;
    } finally {
      session.endSession();
    }

    return transformedList;
}
}

module.exports = new ListService();
