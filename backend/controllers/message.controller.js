const Message = require("../models/Message");

const getWorkspaceMessages = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const messages = await Message.find({ workspace: workspaceId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const { workspaceId, content } = req.body;
    const message = await Message.create({
      workspace: workspaceId,
      sender: req.user._id,
      content,
    });
    const populated = await message.populate("sender", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWorkspaceMessages, createMessage };