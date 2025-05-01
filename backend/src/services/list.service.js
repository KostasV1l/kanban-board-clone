const BaseService = require("./base.service");
const List = require("../models/list.model");
const { default: mongoose } = require("mongoose");

class ListService extends BaseService {
  constructor() {
    super(List);
  }

  async getListsByBoard(boardId) {
    if (!boardId) throw new Error("Board ID is required");

    const objectId = new mongoose.Types.ObjectId(boardId);
    console.log("objectId", objectId);

    const lists = await this.model.find({ boardId: objectId });
    console.log("lists: ", lists);
    console.log("boardID: ", boardId);
    return lists;
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
    if (!data?.title || data.order === undefined) {
      throw new Error("Title and order are required");
    }
    return await this.model.create(data);
  }

  async updateList(listId, data) {
    if (!listId) throw new Error("List ID is required");
    return await this.model.findByIdAndUpdate(listId, data, { new: true });
  }

  async deleteList(listId) {
    if (!listId) throw new Error("List ID is required");
    return await this.model.findByIdAndDelete(listId);
  }
}

module.exports = new ListService();
