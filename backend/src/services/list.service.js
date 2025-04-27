const BaseService = require("./base.service");
const List = require("../models/list.model");

class ListService extends BaseService {
  constructor() {
    super(List);
  }

  async getListsByBoard(boardId) {
    if (!boardId) throw new Error("Board ID is required");
    return await this.model.find({ user: boardId });
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

  async reorderLists(lists) {
    if (!Array.isArray(lists)) {
      throw new Error("Lists array is required for reordering");
    }

    const updatePromises = lists.map(({ _id, order }) =>
      this.model.findByIdAndUpdate(_id, { order })
    );

    return await Promise.all(updatePromises);
  }
}

module.exports = new ListService();
