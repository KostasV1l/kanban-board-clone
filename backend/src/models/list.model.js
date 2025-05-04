const mongoose = require("mongoose");
const { baseOptions } = require("./base.model");

const ListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "List name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: "bg-blue-500",
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  baseOptions
);

// Indexes for faster queries
ListSchema.index({ board: 1 });
ListSchema.index({ board: 1, order: 1 });


const List = mongoose.model("List", ListSchema);
module.exports = List;
