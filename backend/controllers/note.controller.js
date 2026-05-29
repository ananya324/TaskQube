
const Note = require("../models/Note");
const logActivity = require("../utils/logActivity");
const { getIO } = require("../config/socket");

const createNote = async (req, res) => {
  try {
    const { workspaceId, title, bullets } = req.body;

    const note = await Note.create({
      workspace: workspaceId,
      title: title || "Untitled Note",
      bullets: bullets || [],
      createdBy: req.user._id,
    });

    const populated = await note.populate("createdBy", "name email");

    await logActivity({
      workspace: workspaceId,
      user: req.user._id,
      action: `added a note: "${title || "Untitled Note"}"`,
      entityType: "note",
      entityId: note._id,
    });

    // Emit new-activity to workspace room
    getIO().to(workspaceId).emit("new-activity");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkspaceNotes = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const notes = await Note.find({ workspace: workspaceId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, bullets } = req.body;

    const note = await Note.findByIdAndUpdate(
      noteId,
      { title, bullets },
      { new: true }
    ).populate("createdBy", "name email");

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    await Note.findByIdAndDelete(noteId);
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNote,
  getWorkspaceNotes,
  updateNote,
  deleteNote,
};