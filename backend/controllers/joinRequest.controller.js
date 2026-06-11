const JoinRequest = require("../models/JoinRequest");
const Workspace = require("../models/Workspace");
const User = require("../models/User");
const { getIO } = require("../config/socket");
const logActivity = require("../utils/logActivity");

// Member requests to join
const requestToJoin = async (req, res) => {
  try {
    const { roomCode } = req.body;

    const workspace = await Workspace.findOne({ roomCode })
      .populate("owner", "name email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if already a member
    const alreadyMember = workspace.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    // Check if already requested
    const existingRequest = await JoinRequest.findOne({
      workspace: workspace._id,
      user: req.user._id,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const joinRequest = await JoinRequest.create({
      workspace: workspace._id,
      user: req.user._id,
    });

    const populated = await joinRequest.populate("user", "name email");

    // Notify admin via socket
    try {
      getIO().to(workspace._id.toString()).emit("join-request", {
        request: populated,
        workspaceName: workspace.name,
      });
    } catch (e) {
      console.log("Socket error:", e.message);
    }

    res.status(201).json({
      message: "Join request sent! Waiting for admin approval.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin gets all pending requests
const getPendingRequests = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const requests = await JoinRequest.find({
      workspace: workspaceId,
      status: "pending",
    }).populate("user", "name email");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin accepts request
const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await JoinRequest.findById(requestId)
      .populate("user", "name email")
      .populate("workspace");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Add member to workspace
    await Workspace.findByIdAndUpdate(request.workspace._id, {
      $push: { members: request.user._id },
    });

    await User.findByIdAndUpdate(request.user._id, {
      $push: { workspaces: request.workspace._id },
    });

    // Update request status
    request.status = "accepted";
    await request.save();

    // Log activity
    try {
      await logActivity({
        workspace: request.workspace._id,
        user: request.user._id,
        action: "joined the workspace",
        entityType: "workspace",
        entityId: request.workspace._id,
      });
      getIO().to(request.workspace._id.toString()).emit("new-activity");
    } catch (e) {
      console.log("Activity error:", e.message);
    }

    // Notify the requesting user via socket
    try {
      getIO().emit("join-request-response", {
        userId: request.user._id.toString(),
        status: "accepted",
        workspace: request.workspace,
      });
    } catch (e) {
      console.log("Socket error:", e.message);
    }

    res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin rejects request
const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await JoinRequest.findById(requestId)
      .populate("user", "name email")
      .populate("workspace");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    // Notify the requesting user
    try {
      getIO().emit("join-request-response", {
        userId: request.user._id.toString(),
        status: "rejected",
        workspace: request.workspace,
      });
    } catch (e) {
      console.log("Socket error:", e.message);
    }

    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  requestToJoin,
  getPendingRequests,
  acceptRequest,
  rejectRequest,
};