import { Trash2, RefreshCw, Calendar, Clock } from "lucide-react";

const PRIORITY = {
  low:    { label: "Low",    color: "#059669", bg: "#ecfdf5" },
  medium: { label: "Medium", color: "#d97706", bg: "#fffbeb" },
  high:   { label: "High",   color: "#e11d48", bg: "#fff1f2" },
};

const STATUS_OPTIONS = ["todo", "in-progress", "completed"];

const STATUS_STYLES = {
  "todo":        { color: "#64748b", bg: "#f1f5f9" },
  "in-progress": { color: "#0891b2", bg: "#ecfeff" },
  "completed":   { color: "#059669", bg: "#ecfdf5" },
};

const STATUS_LABELS = {
  "todo": "Todo",
  "in-progress": "In Progress",
  "completed": "Completed",
};

const avatarColor = (name = "") => {
  const colors = ["#0d9488", "#0891b2", "#7c3aed", "#d97706", "#be185d", "#059669"];
  return colors[name.charCodeAt(0) % colors.length];
};

const isOverdue = (task) =>
  !!task.dueDate && task.status !== "completed" && new Date(task.dueDate) < new Date();

const isDueSoon = (task) => {
  if (!task.dueDate || task.status === "completed") return false;
  const hrs = (new Date(task.dueDate) - new Date()) / 3600000;
  return hrs > 0 && hrs <= 24;
};

const TaskCard = ({ task, isAdmin, currentUserId, onDelete, onStatusChange, onReassign }) => {
  const overdue      = isOverdue(task);
  const dueSoon      = isDueSoon(task);
  const isCompleted  = task.status === "completed";
  const isAssignedToMe = task.assignedTo?._id === currentUserId;
  const priority     = PRIORITY[task.priority] || PRIORITY.medium;
  const statusStyle  = STATUS_STYLES[task.status] || STATUS_STYLES.todo;
  const assigneeName = task.assignedTo?.name || "Unassigned";

  // card border/bg state
  const cardState = isCompleted ? "completed" : overdue ? "overdue" : dueSoon ? "soon" : "default";

  return (
    <>
      <style>{`
        .tc-wrap {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 11px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .tc-wrap:hover {
          box-shadow: 0 4px 18px rgba(13,148,136,0.09);
          transform: translateY(-1px);
        }
        .tc-wrap.overdue  { border-color: #fecdd3; background: #fffafa; }
        .tc-wrap.soon     { border-color: #fde68a; background: #fffdf5; }
        .tc-wrap.completed { border-color: #e2e8f0; background: #f8fafc; opacity: 0.78; }

        /* status banner */
        .tc-banner {
          display: flex; align-items: center; gap: 7px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.03em;
          padding: 6px 10px; border-radius: 9px; margin-bottom: -2px;
        }
        .tc-banner.overdue { color: #e11d48; background: #fff1f2; }
        .tc-banner.soon    { color: #b45309; background: #fef3c7; }

        /* header */
        .tc-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
        .tc-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 14px; font-weight: 700; color: #0f172a; line-height: 1.4; flex: 1;
        }
        .tc-title.completed { text-decoration: line-through; color: #94a3b8; }
        .tc-delete {
          background: none; border: none; cursor: pointer; padding: 3px;
          border-radius: 7px; color: #cbd5e1; flex-shrink: 0;
          opacity: 0; transition: opacity 0.15s, color 0.15s, background 0.15s;
        }
        .tc-wrap:hover .tc-delete { opacity: 1; }
        .tc-delete:hover { color: #e11d48; background: #fff1f2; }

        /* desc */
        .tc-desc {
          font-size: 12.5px; color: #94a3b8; line-height: 1.65;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        /* meta */
        .tc-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .tc-meta-item { display: flex; align-items: center; gap: 6px; }
        .tc-meta-text { font-size: 12px; color: #94a3b8; }
        .tc-avatar {
          width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #fff; flex-shrink: 0;
        }

        /* footer */
        .tc-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 11px; border-top: 1px solid #f1f5f9; gap: 8px; flex-wrap: wrap;
        }
        .tc-priority {
          font-size: 11px; font-weight: 700; letter-spacing: 0.03em;
          padding: 3px 10px; border-radius: 100px;
        }
        .tc-footer-right { display: flex; align-items: center; gap: 8px; }
        .tc-reassign {
          display: inline-flex; align-items: center; gap: 5px;
          background: none; border: 1.5px solid #e2e8f0; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 600; color: #64748b;
          padding: 4px 10px; border-radius: 8px;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .tc-reassign:hover { border-color: #0d9488; color: #0d9488; background: #f0fdfa; }
        .tc-select {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 700; border-radius: 8px;
          padding: 4px 22px 4px 9px; cursor: pointer; outline: none;
          border: 1.5px solid transparent;
          appearance: none; -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 7px center;
          transition: border-color 0.15s;
        }
        .tc-select:focus { border-color: #0d9488; }
      `}</style>

      <div className={`tc-wrap ${cardState}`}>

        {/* Status banner */}
        {overdue && (
          <div className="tc-banner overdue">
            <Clock size={12} /> Deadline passed
          </div>
        )}
        {dueSoon && !overdue && (
          <div className="tc-banner soon">
            <Clock size={12} /> Due within 24 hours
          </div>
        )}

        {/* Header */}
        <div className="tc-header">
          <span className={`tc-title${isCompleted ? " completed" : ""}`}>{task.title}</span>
          {isAdmin && (
            <button className="tc-delete" onClick={() => onDelete(task._id)} title="Delete task">
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Description */}
        {task.description && <p className="tc-desc">{task.description}</p>}

        {/* Meta */}
        <div className="tc-meta">
          <div className="tc-meta-item">
            <div className="tc-avatar" style={{ background: avatarColor(assigneeName) }}>
              {assigneeName.charAt(0).toUpperCase()}
            </div>
            <span className="tc-meta-text">{assigneeName}</span>
          </div>

          {task.dueDate && (
            <div className="tc-meta-item">
              <Calendar
                size={12}
                color={overdue ? "#e11d48" : dueSoon ? "#b45309" : "#94a3b8"}
              />
              <span
                className="tc-meta-text"
                style={{ color: overdue ? "#e11d48" : dueSoon ? "#b45309" : undefined }}
              >
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="tc-footer">
          <span className="tc-priority" style={{ color: priority.color, background: priority.bg }}>
            {priority.label}
          </span>

          <div className="tc-footer-right">
            {isAdmin && (
              <button className="tc-reassign" onClick={() => onReassign(task)}>
                <RefreshCw size={10} /> Reassign
              </button>
            )}
            {(isAdmin || isAssignedToMe) && (
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task, e.target.value)}
                className="tc-select"
                style={{ color: statusStyle.color, background: statusStyle.bg }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;