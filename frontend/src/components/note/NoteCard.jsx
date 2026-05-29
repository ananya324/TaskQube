import { Trash2, FileText } from "lucide-react";

const avatarColor = (name = "") => {
  const colors = ["#0d9488", "#0891b2", "#7c3aed", "#d97706", "#be185d", "#059669"];
  return colors[name.charCodeAt(0) % colors.length];
};

const NoteCard = ({ note, onOpen, onDelete, currentUserId }) => {
  const canDelete = note.createdBy?._id === currentUserId;
  const authorName = note.createdBy?.name || "Unknown";
  const bulletCount = note.bullets?.length || 0;
  const preview = note.bullets?.slice(0, 3) || [];

  return (
    <>
      <style>{`
        .nc-wrap {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: box-shadow 0.2s, transform 0.2s;
          position: relative;
        }
        .nc-wrap:hover {
          box-shadow: 0 4px 18px rgba(13,148,136,0.09);
          transform: translateY(-1px);
        }

        .nc-delete {
          position: absolute; top: 14px; right: 14px;
          background: none; border: none; cursor: pointer;
          padding: 4px; border-radius: 7px;
          color: #cbd5e1; opacity: 0;
          transition: opacity 0.15s, color 0.15s, background 0.15s;
        }
        .nc-wrap:hover .nc-delete { opacity: 1; }
        .nc-delete:hover { color: #e11d48; background: #fff1f2; }

        .nc-header { display: flex; align-items: center; gap: 10px; padding-right: 24px; }
        .nc-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(13,148,136,0.08);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .nc-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 14px; font-weight: 700; color: #0f172a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .nc-bullets { display: flex; flex-direction: column; gap: 6px; }
        .nc-bullet-item { display: flex; align-items: flex-start; gap: 8px; }
        .nc-bullet-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #5eead4; margin-top: 5px; flex-shrink: 0;
        }
        .nc-bullet-text {
          font-size: 12.5px; color: #64748b; line-height: 1.5;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .nc-more { font-size: 11.5px; color: #94a3b8; padding-left: 13px; }
        .nc-empty { font-size: 12px; color: #cbd5e1; font-style: italic; }

        .nc-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 12px; border-top: 1px solid #f1f5f9;
        }
        .nc-author { display: flex; align-items: center; gap: 6px; }
        .nc-avatar {
          width: 18px; height: 18px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .nc-author-name { font-size: 12px; color: #94a3b8; font-weight: 500; }
        .nc-date { font-size: 11.5px; color: #cbd5e1; }
      `}</style>

      <div className="nc-wrap" onClick={() => onOpen(note)}>

        {/* Delete */}
        {canDelete && (
          <button
            className="nc-delete"
            onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
            title="Delete note"
          >
            <Trash2 size={14} />
          </button>
        )}

        {/* Header */}
        <div className="nc-header">
          <div className="nc-icon">
            <FileText size={16} color="#0d9488" strokeWidth={1.75} />
          </div>
          <span className="nc-title">{note.title || "Untitled Note"}</span>
        </div>

        {/* Bullets preview */}
        <div className="nc-bullets">
          {bulletCount === 0 ? (
            <span className="nc-empty">No content yet</span>
          ) : (
            <>
              {preview.map((bullet, i) => (
                <div key={i} className="nc-bullet-item">
                  <div className="nc-bullet-dot" />
                  <span className="nc-bullet-text">{bullet}</span>
                </div>
              ))}
              {bulletCount > 3 && (
                <span className="nc-more">+{bulletCount - 3} more</span>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="nc-footer">
          <div className="nc-author">
            <div
              className="nc-avatar"
              style={{ background: avatarColor(authorName) }}
            >
              {authorName.charAt(0).toUpperCase()}
            </div>
            <span className="nc-author-name">{authorName}</span>
          </div>
          <span className="nc-date">
            {new Date(note.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric",
            })}
          </span>
        </div>
      </div>
    </>
  );
};

export default NoteCard;