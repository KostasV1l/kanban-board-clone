const mongoose = require("mongoose");
const { baseOptions } = require("./base.model");

const ListSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "List name is required"],
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        guestId: {
            type: String,
        },
        description: {
            type: String,
            trim: true,
        },
        board: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Board",
            },
        ],
        color: {
            type: String,
            default: "bg-blue-500",
        },
    },
    baseOptions
);

// Indexes for faster queries
ListSchema.index({ user: 1 });
ListSchema.index({ guestId: 1 });

const List = mongoose.model("List", ListSchema);
module.exports = List;
