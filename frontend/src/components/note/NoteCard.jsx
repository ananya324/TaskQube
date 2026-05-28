import { Trash2, FileText } from "lucide-react";

const NoteCard = ({ note, onOpen, onDelete, currentUserId }) => {
  const canDelete = note.createdBy?._id === currentUserId;

  return (
    <div
      onClick={() => onOpen(note)}
      className="bg-surface border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/30 hover:shadow-sm transition group relative"
    >
      {/* Delete button */}
      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note._id);
          }}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-muted hover:text-rose-500 transition"
        >
          <Trash2 size={13} />
        </button>
      )}

      {/* Icon + Title */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText size={14} className="text-primary" />
        </div>
        <h3 className="font-heading font-semibold text-gray-900 text-sm line-clamp-1">
          {note.title || "Untitled Note"}
        </h3>
      </div>

      {/* Bullets preview */}
      <ul className="space-y-1 mb-4">
        {note.bullets?.slice(0, 3).map((bullet, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted">
            <span className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
            <span className="line-clamp-1">{bullet}</span>
          </li>
        ))}
        {note.bullets?.length > 3 && (
          <li className="text-xs text-muted pl-3">+{note.bullets.length - 3} more...</li>
        )}
        {note.bullets?.length === 0 && (
          <li className="text-xs text-muted italic">No bullets yet</li>
        )}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted">{note.createdBy?.name}</span>
        <span className="text-xs text-muted">
          {new Date(note.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric"
          })}
        </span>
      </div>
    </div>
  );
};

export default NoteCard;