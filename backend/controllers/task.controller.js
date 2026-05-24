const Task = require("../models/Task");
const Workspace = require("../models/Workspace");

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
            return res.status(404).json({
                message: "Workspace not found",
            });
        }
        const task = await Task.create({
            title,
            description,
            workspace: workspaceId,
            assignedTo,
            createdBy: req.user._id,
            priority,
            dueDate,
        });
        res.status(201).json(task);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
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

    res.status(200).json(task);
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