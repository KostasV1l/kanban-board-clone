const mongoose = require("mongoose");
const { baseOptions } = require("./base.model");

const BoardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Board name is required"],
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Optional for guests
        },
        guestId: {
            type: String,
            required: false, // Only required for guest boards
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
        lists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Column",
            },
        ],
        color: {
            type: String,
            required: false,
            default: "bg-blue-500",
        },
    },
    baseOptions
);

// Indexes for faster queries
BoardSchema.index({ user: 1 });
BoardSchema.index({ guestId: 1 });

const Board = mongoose.model("Board", BoardSchema);
module.exports = Board;
