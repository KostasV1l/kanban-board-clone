const BaseService = require("./base.service");
const Task = require("../models/task.model");
const List = require("../models/list.model");
const mongoose = require("mongoose");

class TaskService extends BaseService {
  constructor() {
    super(Task);
  }

  // Get all tasks for a specific list
  async getTasksByList(listId) {
    if (!listId) throw new Error("List ID is required");

    const tasks = await this.model
      .find({ list: listId })
      .sort({ order: 1 })
      .exec();

    return tasks;
  }

  // Get all tasks for a specific board
  async getTasksByBoard(boardId) {
    if (!boardId) throw new Error("Board ID is required");

    const tasks = await this.model
      .find({ board: boardId })
      .sort({ order: 1 })
      .exec();

    return tasks;
  }

  // Create a new task
  async createTask(data) {
    const session = await mongoose.startSession();
    try {
      // ensures that all ops either succeed or fail
      session.startTransaction();

      // In Mongoose's transaction API, the create() method requires documents to be passed as an array
      // session contains the MongoDB session object that links all operations in the transaction together
      const task = await this.model.create([data], { session });

      // Update the list to include this task
      await List.findByIdAndUpdate(
        data.list,
        { $push: { tasks: task[0]._id } },
        { session }
      );

      await session.commitTransaction();
      return task[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Update a task
  async updateTask(taskId, data) {
    if (!taskId) throw new Error("Task ID is required");

    // If list is being updated, we need to update the old and new lists
    if (data.list) {
      const session = await mongoose.startSession();
      try {
        session.startTransaction();

        // Get the current task to find the old list
        const currentTask = await this.model.findById(taskId);
        if (!currentTask) throw new Error("Task not found");

        // If the list is changed
        if (currentTask.list.toString() !== data.list.toString()) {
          // Remove task from old list
          await List.findByIdAndUpdate(
            currentTask.list,
            { $pull: { tasks: taskId } },
            { session }
          );

          // Add task to new list
          await List.findByIdAndUpdate(
            data.list,
            { $push: { tasks: taskId } },
            { session }
          );
        }

        // Update the task
        // with new: true we get back the updated task, not the original one.
        // without it, the new task is still saved to db, but old one is returned as updatedTask
        const updatedTask = await this.model.findByIdAndUpdate(taskId, data, {
          new: true,
          session,
          runValidators: true,
        });

        await session.commitTransaction();
        return updatedTask;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } else {
      // Simple update without list changes
      return await this.model.findByIdAndUpdate(taskId, data, {
        new: true,
        runValidators: true,
      });
    }
  }

  // Delete a task
  async deleteTask(taskId) {
    if (!taskId) throw new Error("Task ID is required");

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Get the task to find its list
      const task = await this.model.findById(taskId);
      if (!task) throw new Error("Task not found");

      // Remove task from list
      await List.findByIdAndUpdate(
        task.list,
        { $pull: { tasks: taskId } },
        { session }
      );

      // Delete the task
      const deletedTask = await this.model
        .findByIdAndDelete(taskId)
        .session(session);
        // All changes made within the transaction are permanently saved to the database
      await session.commitTransaction();
      return deletedTask;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      // All resources associated with the session are released
      session.endSession();
    }
  }

  // Delete all tasks for a list
  async deleteTasksByList(listId) {
    if (!listId) throw new Error("List ID is required");
    return await this.model.deleteMany({ list: listId });
  }
}

module.exports = new TaskService();
