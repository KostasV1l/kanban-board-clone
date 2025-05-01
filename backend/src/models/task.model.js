const mongoose = require("mongoose");
const { baseOptions } = require("./base.model");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
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
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  baseOptions
);

// Indexes for faster queries
TaskSchema.index({ user: 1 });
TaskSchema.index({ guestId: 1 });
TaskSchema.index({ list: 1 });
TaskSchema.index({ board: 1 });
TaskSchema.index({ assignedTo: 1 });

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
