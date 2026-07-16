const Task = require("../models/Task");
const Workspace = require("../models/Workspace");
const logActivity = require("../utils/logActivity");
const { createTaskService } = require("../services/task.service");
const { getIO } = require("../config/socket");

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      workspaceId,
      assignedTo,
      priority,
      dueDate,
    } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const task = await createTaskService({
      title,
      description,
      workspaceId,
      assignedTo,
      createdBy: req.user._id,
      priority,
      dueDate,
    });

    // Get assigned user name for activity
    const User = require("../models/User");
    const assignedUser = assignedTo ? await User.findById(assignedTo) : null;

    await logActivity({
      workspace: workspaceId,
      user: req.user._id,
      action: `assigned task "${title}" to ${assignedUser?.name || "someone"}`,
      entityType: "task",
      entityId: task._id,
    });

    // Emit new-activity to workspace room
    getIO().to(workspaceId).emit("new-activity");

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getWorkspaceTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const tasks = await Task.find({
      workspace: workspaceId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { status } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status = status;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createTask,
  getWorkspaceTasks,
  updateTaskStatus,
  deleteTask,
};