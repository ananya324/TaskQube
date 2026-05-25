const Workspace = require("../models/Workspace");

const User = require("../models/User");

const generateRoomCode = require("../utils/generateRoomCode");

const createWorkspaceService = async ({
  name,
  description,
  userId,
}) => {
  const workspace = await Workspace.create({
    name,
    description,
    owner: userId,
    members: [userId],
    roomCode: generateRoomCode(),
  });

  await User.findByIdAndUpdate(userId, {
    $push: {
      workspaces: workspace._id,
    },
  });

  return workspace;
};

module.exports = {
  createWorkspaceService,
};