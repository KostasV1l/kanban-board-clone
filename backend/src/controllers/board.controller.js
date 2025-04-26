const boardService = require("../services/board.service");

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
            if (!req.user || !req.user._id) {
                return res.status(401).json({ message: "User authentication required" });
            }
            // Get boards for the current authenticated user
            boards = await boardService.getBoardsByUser(req.user._id);
        }

        res.status(200).json(boards);
    } catch (error) {
        next(error);
    }
};

// @desc    Get boards for guest user
// @route   GET /api/boards/guest/:guestId
exports.getGuestBoards = async (req, res, next) => {
    try {
        const { guestId } = req.params;

        const boards = await boardService.getBoardsByGuest(guestId);

        if (!boards.length) {
            return res.status(404).json({ message: "No boards found for this guest" });
        }

        res.status(200).json(boards);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new board
// @route   POST /api/boards
exports.createBoard = async (req, res, next) => {
    try {
        const { name, description, color } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User authentication required" });
        }

        const board = await boardService.create({
            name,
            description,
            color,
            user: req.user._id,
        });

        res.status(201).json(board);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a board for guest
// @route   POST /api/boards/guest/:guestId
exports.createGuestBoard = async (req, res, next) => {
    try {
        const { guestId } = req.params;
        const { name, description, color } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const board = await boardService.create({
            name,
            description,
            color,
            guestId,
        });

        res.status(201).json(board);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a specific board
// @route   GET /api/boards/:boardId
exports.getBoard = async (req, res, next) => {
    try {
        const board = await boardService.findById(req.params.boardId);

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        // Check ownership for authenticated users
        if (board.user && req.user && board.user.toString() !== req.user._id?.toString()) {
            return res.status(401).json({ message: "Not authorized to access this board" });
        }

        res.status(200).json(board);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a specific board
// @route   PUT /api/boards/:boardId
exports.updateBoard = async (req, res, next) => {
    try {
        const { name, description, color } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        let board = await boardService.findById(req.params.boardId);

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        // Check ownership
        if (board.user && req.user && board.user.toString() !== req.user._id?.toString()) {
            return res.status(401).json({ message: "Not authorized to update this board" });
        }

        board = await boardService.update(req.params.boardId, { name, description, color });

        res.status(200).json(board);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a specific board
// @route   DELETE /api/boards/:boardId
exports.deleteBoard = async (req, res, next) => {
    try {
        const board = await boardService.findById(req.params.boardId);

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        // Check ownership
        if (board.user && req.user && board.user.toString() !== req.user._id?.toString()) {
            return res.status(401).json({ message: "Not authorized to delete this board" });
        }

        await boardService.delete(req.params.boardId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
