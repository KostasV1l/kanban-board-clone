const mongoose = require("mongoose");
const { baseOptions } = require("./base.model");
const { TASK_STATUS, TASK_PRIORITY } = require("../config/constants");

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
      enum: Object.values(TASK_STATUS),
    },
    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: TASK_PRIORITY.MEDIUM,
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
TaskSchema.index({ list: 1 });
TaskSchema.index({ board: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ list: 1, order: 1 });

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
