const { default: mongoose } = require("mongoose");
const boardService = require("../services/board.service");
const BoardMember = require("../models/boardMember.model");
const { ROLES } = require("../config/constants");
const {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
  BoardAccessError,
  BoardNotFoundError,
} = require("../utils/ApiError");

// @desc    Get all boards for authenticated user
// @route   GET /api/boards?userId=123
exports.getBoards = async (req, res, next) => {
  try {
    let boards;

    // If userId query param is provided, get boards for the specific user
    if (req.query.userId) {
      boards = await boardService.getBoardsByUser(req.query.userId);
    } else {
      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        return next(new UnauthorizedError("User authentication required"));
      }
      // Get boards for the current authenticated user
      boards = await boardService.getBoardsByUser(req.user.id);
    }

    res.status(200).json(boards);
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a new board
// @route   POST /api/boards
exports.createBoard = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return next(new BadRequestError("Name is required"));
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return next(new UnauthorizedError("User authentication required"));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const board = await boardService.create(
        {
          name,
          description,
          color,
        },
        { session }
      );

      await BoardMember.create(
        [
          {
            board: board._id,
            user: req.user.id,
            role: ROLES.OWNER,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(201).json(board);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    return next(error);
  }
};

// @desc    Get a specific board
// @route   GET /api/boards/:boardId
exports.getBoard = async (req, res, next) => {
  try {
    const board = await boardService.findById(req.params.boardId);

    if (!board) {
      return next(new BoardNotFoundError());
    }

    res.status(200).json(board);
  } catch (error) {
    return next(error);
  }
};

// @desc    Update a specific board
// @route   PUT /api/boards/:boardId
exports.updateBoard = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    let board = await boardService.findById(req.params.boardId);

    if (!board) {
      return next(new BoardNotFoundError());
    }

    board = await boardService.update(req.params.boardId, {
      name,
      description,
      color,
    });

    res.status(200).json(board);
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete a specific board
// @route   DELETE /api/boards/:boardId
exports.deleteBoard = async (req, res, next) => {
  try {
    const board = await boardService.findById(req.params.boardId);

    if (!board) {
      return next(new BoardNotFoundError());
    }

    const deletedBoard = await boardService.delete(req.params.boardId);

    res.status(200).send(deletedBoard);
  } catch (error) {
    return next(error);
  }
};
