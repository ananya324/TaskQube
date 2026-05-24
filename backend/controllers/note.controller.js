const Note = require("../models/Note");
const Nodte = require("../models/Note");

const createNote = async (req, res) => {
    try {
        const { workspaceId, content } = req.body;

        const note = await Note.create({
            workspace: workspaceId,
            content,
            //req.user Come From authentication middleware.
            createdBy: req.user._id,
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getWorkspaceNotes = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const notes = await Note.find({
            workspace: workspaceId,
        }).populate("createdBy", "name email");

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });

    }
};

module.exports = {
    createNote,
    getWorkspaceNotes,
};