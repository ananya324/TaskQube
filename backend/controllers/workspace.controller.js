const Workspace = require("../models/Workspace");
const User = require("../models/User");
const generateRoomCode = require("../utils/generateRoomCode");
const Activity = require("../models/Activity");
const {
  createWorkspaceService,
} = require("../services/workspace.service");


const createWorkspace = async (req, res) => {
  try {
    const workspace =
      await createWorkspaceService({
        ...req.body,
        userId: req.user._id,
      });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//This controller fetches all workspaces where the logged-in user is a member.
const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      members: req.user._id,
    })
      .populate("owner", "name email")
      .populate("members", "name email");
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const joinWorkspace = async (req, res) => {
  try {
    const { roomCode } = req.body;

    const workspace = await Workspace.findOne({ roomCode });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }
    const alreadyMember = workspace.members.some(
      (member) => member.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({
        message: "Already joined workspace",
      });
    }

    await Workspace.findByIdAndUpdate(workspace._id, {
      $push: {
        members: req.user._id,
      },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        workspaces: workspace._id,
      },
    });
    await logActivity({
      workspace: workspace._id,
      user: req.user._id,
      action: "joined the workspace",
      entityType: "workspace",
      entityId: workspace._id,
    });

    res.status(200).json({
      message: "Workspace joined successfully",
      workspace,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getWorkspaceActivities = async (req, res) => {
  try {
    const workspaceId = req.params.id; // ← was req.params.workspaceId
    const activities = await Activity.find({ workspace: workspaceId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWorkspace,
  getUserWorkspaces,
  joinWorkspace,
  getWorkspaceById,
  getWorkspaceActivities,
};