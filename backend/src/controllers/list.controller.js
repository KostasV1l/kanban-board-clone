const listService = require("../services/list.service");

// @desc    Get all lists from the board
// @route   Get /api/boardId1/lists

exports.getLists = async (req, res, next) => {
  try {
    let lists;

    if (req.query.boardId) {
      lists = await listService.getListsByBoard(req.query.boardId);
    }
    res.status(200).json(lists);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single list by ID
// @route   GET /api/lists/:listId
exports.getList = async (req, res, next) => {
  try {
    const list = await listService.getListById(req.params.listId);
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new list
// @route   POST /api/lists
exports.createList = async (req, res, next) => {
  try {
    const { name, board, order } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!board || order === undefined) {
      return res.status(400).json({ message: "Board and order are required" });
    }

    const newList = await listService.createList(req.body);
    res.status(201).json(newList);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing list
// @route   PUT /api/lists/:listId
exports.updateList = async (req, res, next) => {
  try {
    const updatedList = await listService.updateList(
      req.params.listId,
      req.body
    );
    res.status(200).json(updatedList);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a list
// @route   DELETE /api/lists/:listId
exports.deleteList = async (req, res, next) => {
  try {
    const list = await listService.getListById(req.params.listId);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    await listService.deleteList(req.params.listId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
