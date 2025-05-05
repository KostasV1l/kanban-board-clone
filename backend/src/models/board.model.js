const mongoose = require("mongoose");
const { baseOptions } = require("./base.model");

const BoardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Board name is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        lists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "List",
            },
        ],
        color: {
            type: String,
            default: "bg-blue-500",
        },
    },
    baseOptions
);


const Board = mongoose.model("Board", BoardSchema);
module.exports = Board;
