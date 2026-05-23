const Workspace = require("../models/Workspace");
const User = require("../models/User");
const generateRoomCode = require("../utils/generateRoomCode");

const createWorkspace = async (req, res) => {

    try {
        const { name, description } = req.body;

        const workspace = await Workspace.create({
            name,
            description,
            owner: req.user._id,
            members: [req.user._id],
            roomCode: generateRoomCode(),
        });

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                workspaces: workspace._id,
            },
        });
        res.status(201).json(workspace);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
module.exports = {
    createWorkspace,
};