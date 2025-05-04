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

    return await this.model.find({ board: boardId });
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

    try {
      session.startTransaction();

      // Create the list
      const list = await this.model.create([data], { session });

      // Add list ID to board.lists[]
      await Board.findByIdAndUpdate(
        data.board,
        { $push: { lists: list[0]._id } },
        { session }
      );

      await session.commitTransaction();
      return list[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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

    try {
      session.startTransaction();

      // Find the list first to get the list ID
      const list = await List.findById(listId).session(session);
      if (!list) throw new Error("List not found");

      // Delete the list
      await List.findByIdAndDelete(listId).session(session);

      // Remove list ID from Board.lists[]
      await Board.findByIdAndUpdate(
        list.board,
        { $pull: { lists: list._id } },
        { session }
      );

      await session.commitTransaction();
      return list; // Optionally return the deleted list
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async reorderLists(boardId, listsIds) {
    if (!boardId || !Array.isArray(listsIds)) throw new Error("Invalid input");

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const updatedLists = [];

      for (let i = 0; i < listsIds.length; i++) {
        const listId = listsIds[i];
        const updated = await List.findByIdAndUpdate(
          listId,
          { order: i },
          { new: true, session }
        );
        updatedLists.push(updated);
      }

      await session.commitTransaction();
      return updatedLists;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}

module.exports = new ListService();
