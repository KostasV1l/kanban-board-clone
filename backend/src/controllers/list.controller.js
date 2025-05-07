const List = require("../models/list.model");
const listService = require("../services/list.service");
const { BadRequestError, NotFoundError, ListNotFoundError } = require("../utils/ApiError");

// @desc    Get all lists from the board
// @route   Get /api/boards/:boardId/lists
exports.getLists = async (req, res, next) => {
  try {
    const boardId = req.params.boardId;
    const lists = await listService.getListsByBoard(boardId);
    res.status(200).json(lists);
  } catch (error) {
    return next(error);
  }
};

// @desc    Get a single list by ID
// @route   GET /api/boards/:boardId/lists/:listId
exports.getList = async (req, res, next) => {
  try {
    const list = await listService.getListById(req.params.listId);
    if (!list) {
      return next(new ListNotFoundError());
    }
    res.status(200).json(list);
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a new list
// @route   POST /api/boards/:boardId/lists
exports.createList = async (req, res, next) => {
  try {
    const boardId = req.params.boardId;
    const { name, order } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return next(new BadRequestError("Name is required"));
    }

    if (order === undefined) {
      return next(new BadRequestError("Board and order are required"));
    }

    req.body.board = boardId;

    const newList = await listService.createList(req.body);
    res.status(201).json(newList);
  } catch (error) {
    return next(error);
  }
};

// @desc    Update an existing list
// @route   PUT /api/boards/:boardId/lists/:listId
exports.updateList = async (req, res, next) => {
  try {
    const updatedList = await listService.updateList(
      req.params.listId,
      req.body
    );
    res.status(200).json(updatedList);
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete a list
// @route   DELETE /api/boards/:boardId/lists/:listId
exports.deleteList = async (req, res, next) => {
  try {
    const list = await listService.getListById(req.params.listId);

    if (!list) {
      return next(new ListNotFoundError());
    }

    const deletedList = await listService.deleteList(req.params.listId);
    res.status(200).json(deletedList);
  } catch (error) {
    return next(error);
  }
};

exports.reorderLists = async (req, res, next) => {
  try {
    const { listUpdates } = req.body;

    if (!Array.isArray(listUpdates)) {
      console.log("listUpdates", listUpdates);
      return next(new BadRequestError("listUpdates must be an array"));
    }

    const updates = listUpdates.map(({ id, order }) =>
      List.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updates);

    res.status(200).json({ message: "Lists reordered" });
  } catch (error) {
    return next(error);
  }
};
