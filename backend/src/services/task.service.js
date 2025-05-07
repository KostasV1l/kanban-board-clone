const BaseService = require("./base.service");
const Task = require("../models/task.model");
const List = require("../models/list.model");
const mongoose = require("mongoose");
const socketEvents = require("../utils/socketEvents");
const { BadRequestError, TaskNotFoundError, ListNotFoundError } = require("../utils/ApiError");

class TaskService extends BaseService {
    constructor() {
        super(Task);
    }

    // Get all tasks for a specific list
    async getTasksByList(listId) {
        if (!listId) {
            throw new BadRequestError("List ID is required");
        }

        if (!mongoose.Types.ObjectId.isValid(listId)) {
            throw new BadRequestError("Invalid list ID format");
        }

        const tasks = await this.model.find({ list: listId }).sort({ order: 1 }).exec();

        return tasks;
    }

    // Get all tasks for a specific board
    async getTasksByBoard(boardId) {
        if (!boardId) {
            throw new BadRequestError("Board ID is required");
        }

        if (!mongoose.Types.ObjectId.isValid(boardId)) {
            throw new BadRequestError("Invalid board ID format");
        }

        const tasks = await this.model.find({ board: boardId }).sort({ order: 1 }).exec();

        return tasks;
    }

    // Create a new task
    async createTask(data) {
        if (!data.list || !data.board || !data.title) {
            throw new BadRequestError("List ID, board ID, and title are required");
        }

        const session = await mongoose.startSession();
        try {
            // ensures that all ops either succeed or fail
            session.startTransaction();

            // -1 means "highest to lowest
            // Find the highest order in the current list
            const highestOrderTask = await this.model
                .findOne({ list: data.list }, { order: 1 }, { sort: { order: -1 } })
                .session(session);

            // Set order to be one more than the highest, or 0 if no tasks exist
            data.order = highestOrderTask ? highestOrderTask.order + 1 : 0;

            // In Mongoose's transaction API, the create() method requires documents to be passed as an array
            // session contains the MongoDB session object that links all operations in the transaction together
            const task = await this.model.create([data], { session });

            // Update the list to include this task
            const list = await List.findByIdAndUpdate(
                data.list,
                { $push: { tasks: task[0]._id } },
                { session, new: true }
            );

            if (!list) {
                throw new ListNotFoundError();
            }

            await session.commitTransaction();

            // Emit a socket event on task creation
            socketEvents.taskCreated(data.board, task[0]);

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
        if (!taskId) {
            throw new BadRequestError("Task ID is required");
        }

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new BadRequestError("Invalid task ID format");
        }

        const updateData = { ...data };
        if (updateData.assignedTo === null) {
            updateData.$unset = { assignedTo: 1 };
            delete updateData.assignedTo;
        }

        // If list is being updated, we need to update the old and new lists
        if (updateData.list) {
            const session = await mongoose.startSession();
            try {
                session.startTransaction();

                // Get the current task to find the old list
                const currentTask = await this.model.findById(taskId);
                if (!currentTask) {
                    throw new TaskNotFoundError();
                }

                // If the list is changed
                if (currentTask.list.toString() !== updateData.list.toString()) {
                    // Remove task from old list
                    await List.findByIdAndUpdate(currentTask.list, { $pull: { tasks: taskId } }, { session });

                    // Add task to new list
                    const newList = await List.findByIdAndUpdate(
                        updateData.list,
                        { $push: { tasks: taskId } },
                        { session, new: true }
                    );

                    if (!newList) {
                        throw new ListNotFoundError("The new list was not found");
                    }
                }

                // Update the task
                const updatedTask = await this.model.findByIdAndUpdate(taskId, updateData, {
                    new: true,
                    session,
                    runValidators: true,
                });

                if (!updatedTask) {
                    throw new TaskNotFoundError();
                }

                await session.commitTransaction();
                
                // Emit the task moved event with the previous list ID
                socketEvents.taskMoved(updatedTask.board, updatedTask, currentTask.list.toString());
                
                return updatedTask;
            } catch (error) {
                await session.abortTransaction();
                throw error;
            } finally {
                session.endSession();
            }
        } else {
            // Simple update without list changes
            const updatedTask = await this.model.findByIdAndUpdate(taskId, updateData, {
                new: true,
                runValidators: true,
            });

            if (!updatedTask) {
                throw new TaskNotFoundError();
            }

            // Emit a socket event on task update
            socketEvents.taskUpdated(updatedTask.board, updatedTask);

            return updatedTask;
        }
    }

    // Delete a task
    async deleteTask(taskId) {
        if (!taskId) {
            throw new BadRequestError("Task ID is required");
        }

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new BadRequestError("Invalid task ID format");
        }

        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            // Get the task to find its list
            const task = await this.model.findById(taskId);
            if (!task) {
                throw new TaskNotFoundError();
            }

            // Remove task from list
            await List.findByIdAndUpdate(task.list, { $pull: { tasks: taskId } }, { session });

            // Delete the task
            const deletedTask = await this.model.findByIdAndDelete(taskId).session(session);

            if (!deletedTask) {
                throw new TaskNotFoundError();
            }

            // All changes made within the transaction are permanently saved to the database
            await session.commitTransaction();

            // Emit a socket event on task deletion
            socketEvents.taskDeleted(deletedTask.board, deletedTask);

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
        if (!listId) {
            throw new BadRequestError("List ID is required");
        }

        if (!mongoose.Types.ObjectId.isValid(listId)) {
            throw new BadRequestError("Invalid list ID format");
        }

        return await this.model.deleteMany({ list: listId });
    }
}

module.exports = new TaskService();
