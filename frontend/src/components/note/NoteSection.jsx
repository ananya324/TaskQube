import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getWorkspaceNotes, createNote, updateNote, deleteNote } from "../../api/note.api";
import { getSocket } from "../../socket/socket";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const NoteSection = ({ workspaceId }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [workspaceId]);

  // Socket listeners
  useEffect(() => {
    const socket = getSocket();

    socket.on("receive-note-update", (updatedNote) => {
      setNotes((prev) =>
        prev.some((n) => n._id === updatedNote._id)
          ? prev.map((n) => n._id === updatedNote._id ? updatedNote : n)
          : [...prev, updatedNote]
      );
    });

    return () => {
      socket.off("receive-note-update");
    };
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getWorkspaceNotes(workspaceId);
      setNotes(data);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNote = (note) => {
    setActiveNote(note);
    setShowEditor(true);
  };

  const handleNewNote = () => {
    setActiveNote(null);
    setShowEditor(true);
  };

  const handleSave = async ({ title, bullets }) => {
    try {
      if (activeNote) {
        // Update existing
        const updated = await updateNote(activeNote._id, { title, bullets });
        setNotes((prev) => prev.map((n) => n._id === updated._id ? updated : n));
        getSocket().emit("note-updated", updated);
        toast.success("Note updated!");
      } else {
        // Create new
        const created = await createNote({ workspaceId, title, bullets });
        setNotes((prev) => [created, ...prev]);
        getSocket().emit("note-updated", created);
        toast.success("Note created!");
      }
      setShowEditor(false);
      setActiveNote(null);
    } catch {
      toast.error("Failed to save note");
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-2xl p-6 animate-pulse h-36" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-gray-900">Notes</h2>
        <button
          onClick={handleNewNote}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-4 py-2 rounded-lg transition"
        >
          <Plus size={15} />
          New Note
        </button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
          <p className="text-muted text-sm">No notes yet. Create the first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onOpen={handleOpenNote}
              onDelete={handleDelete}
              currentUserId={user?._id}
            />
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <NoteEditor
          note={activeNote}
          onClose={() => { setShowEditor(false); setActiveNote(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default NoteSection;