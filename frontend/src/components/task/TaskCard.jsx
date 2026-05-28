import { Trash2, RefreshCw, Calendar, User } from "lucide-react";

const PRIORITY_STYLES = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-600",
};

const STATUS_OPTIONS = ["todo", "in-progress", "completed"];

const TaskCard = ({ task, isAdmin, currentUserId, onDelete, onStatusChange, onReassign }) => {
  const isAssignedToMe = task.assignedTo?._id === currentUserId;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed";

  return (
    <div className={`bg-surface border rounded-2xl p-4 group transition hover:shadow-sm ${
      isOverdue ? "border-rose-200 bg-rose-50/30" : "border-border"
    }`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-heading font-semibold text-gray-900 text-sm leading-snug">
          {task.title}
          {isOverdue && (
            <span className="ml-2 text-xs text-rose-500 font-medium">Overdue</span>
          )}
        </p>
        {isAdmin && (
          <button
            onClick={() => onDelete(task._id)}
            className="opacity-0 group-hover:opacity-100 text-muted hover:text-rose-500 transition flex-shrink-0"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-muted text-xs mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Assigned to */}
      <div className="flex items-center gap-1.5 mb-3">
        <User size={12} className="text-muted" />
        <span className="text-xs text-muted">
          {task.assignedTo?.name || "Unassigned"}
        </span>
      </div>

      {/* Due date */}
      {task.dueDate && (
        <div className="flex items-center gap-1.5 mb-3">
          <Calendar size={12} className={isOverdue ? "text-rose-400" : "text-muted"} />
          <span className={`text-xs ${isOverdue ? "text-rose-500 font-medium" : "text-muted"}`}>
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric"
            })}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>
          {task.priority}
        </span>

        <div className="flex items-center gap-2">
          {/* Reassign — admin only */}
          {isAdmin && (
            <button
              onClick={() => onReassign(task)}
              className="text-xs text-muted hover:text-primary flex items-center gap-1 transition"
            >
              <RefreshCw size={11} />
              Reassign
            </button>
          )}

          {/* Status — admin or assigned member */}
          {(isAdmin || isAssignedToMe) && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value)}
              className="text-xs text-muted bg-transparent border border-border rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-primary transition"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "in-progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;