import { useState, useEffect } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { getWorkspaceTasks, createTask, updateTaskStatus, deleteTask } from "../../api/task.api";
import { getSocket } from "../../socket/socket";
import { useAuth } from "../../context/AuthContext";
import TaskCard from "./TaskCard";
import AssignTaskModal from "./AssignTaskModal";
import toast from "react-hot-toast";

const STATUS_COLS = [
  { key: "todo",        label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed",   label: "Completed" },
];

const STATUS_DOT = {
  "todo":        "#94a3b8",
  "in-progress": "#0891b2",
  "completed":   "#059669",
};

const TaskSection = ({ workspaceId, members, isAdmin }) => {
  const { user } = useAuth();
  const [tasks, setTasks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [reassignTask, setReassignTask] = useState(null);

  useEffect(() => { fetchTasks(); }, [workspaceId]);

  useEffect(() => {
    const socket = getSocket();
    socket.on("new-task",    (task)   => setTasks((p) => [...p, task]));
    socket.on("update-task", (updated)=> setTasks((p) => p.map((t) => t._id === updated._id ? updated : t)));
    socket.on("delete-task", (taskId) => setTasks((p) => p.filter((t) => t._id !== taskId)));
    return () => { socket.off("new-task"); socket.off("update-task"); socket.off("delete-task"); };
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getWorkspaceTasks(workspaceId);
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (form) => {
    try {
      const data = await createTask({ ...form, workspaceId });
      setTasks((p) => [...p, data]);
      getSocket().emit("task-created", data);
      toast.success("Task assigned!");
      setShowModal(false);
      setReassignTask(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to assign task");
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const data = await updateTaskStatus(task._id, newStatus);
      const updated = { ...task, status: newStatus, ...data };
      setTasks((p) => p.map((t) => t._id === task._id ? updated : t));
      getSocket().emit("task-updated", updated);
    } catch { toast.error("Failed to update task"); }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((p) => p.filter((t) => t._id !== taskId));
      getSocket().emit("task-deleted", { taskId, workspaceId });
      toast.success("Task deleted");
    } catch { toast.error("Failed to delete task"); }
  };

  const handleReassign = (task) => { setReassignTask(task); setShowModal(true); };

  const myTasks   = tasks.filter((t) => t.assignedTo?._id === user?._id);
  const teamTasks = tasks.filter((t) => t.assignedTo?._id !== user?._id);

  return (
    <>
      <style>{`
        .ts-wrap { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* ── header ── */
        .ts-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 28px; gap: 12px; flex-wrap: wrap;
        }
        .ts-title-row { display: flex; align-items: center; gap: 10px; }
        .ts-icon-box {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(13,148,136,0.1);
          display: flex; align-items: center; justify-content: center;
        }
        .ts-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 20px; font-weight: 800; letter-spacing: -0.4px; color: #0f172a;
        }
        .ts-assign-btn {
          display: inline-flex; align-items: center; gap: 7px;
          background: #0d9488; color: #fff; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700;
          padding: 9px 18px; border-radius: 10px;
          box-shadow: 0 2px 10px rgba(13,148,136,0.25);
          transition: background 0.2s, transform 0.15s;
        }
        .ts-assign-btn:hover { background: #0f766e; transform: translateY(-1px); }

        /* ── skeleton ── */
        .ts-skeleton-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
        }
        @media(max-width:900px){ .ts-skeleton-grid{ grid-template-columns: repeat(2,1fr); } }
        @media(max-width:560px){ .ts-skeleton-grid{ grid-template-columns: 1fr; } }
        .ts-skeleton {
          border-radius: 16px; height: 148px;
          background: linear-gradient(90deg,#f1f5f9 25%,#e8f5f4 50%,#f1f5f9 75%);
          background-size: 200% 100%;
          animation: ts-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes ts-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── empty ── */
        .ts-empty {
          text-align: center; padding: 48px 24px;
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px;
        }
        .ts-empty-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(13,148,136,0.08);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
        }
        .ts-empty-text { font-size: 13px; color: #94a3b8; }

        /* ── kanban ── */
        .ts-kanban {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; align-items: start;
        }
        @media(max-width:900px){ .ts-kanban{ grid-template-columns: repeat(2,1fr); } }
        @media(max-width:560px){ .ts-kanban{ grid-template-columns: 1fr; } }

        .ts-col { display: flex; flex-direction: column; gap: 10px; }
        .ts-col-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px; background: #fff;
          border: 1.5px solid #e2e8f0; border-radius: 12px; margin-bottom: 4px;
        }
        .ts-col-label-row { display: flex; align-items: center; gap: 8px; }
        .ts-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .ts-col-label {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 13px; font-weight: 700; color: #0f172a;
        }
        .ts-col-count {
          font-size: 11px; font-weight: 700; color: #94a3b8;
          background: #f1f5f9; padding: 2px 8px; border-radius: 100px;
        }

        /* ── member section group ── */
        .ts-group { margin-bottom: 32px; }
        .ts-group-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 700; color: #64748b;
          letter-spacing: 0.05em; text-transform: uppercase;
          margin-bottom: 14px;
        }
        .ts-group-badge {
          font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 100px;
        }
        .ts-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 14px;
        }
        @media(max-width:900px){ .ts-grid{ grid-template-columns: repeat(2,1fr); } }
        @media(max-width:560px){ .ts-grid{ grid-template-columns: 1fr; } }
      `}</style>

      <div className="ts-wrap">

        {/* Header */}
        <div className="ts-header">
          <div className="ts-title-row">
            <div className="ts-icon-box">
              <ClipboardList size={17} color="#0d9488" strokeWidth={2} />
            </div>
            <span className="ts-title">Tasks</span>
          </div>
          {isAdmin && (
            <button
              className="ts-assign-btn"
              onClick={() => { setReassignTask(null); setShowModal(true); }}
            >
              <Plus size={14} /> Assign Task
            </button>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="ts-skeleton-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="ts-skeleton" />)}
          </div>

        ) : isAdmin ? (
          /* ── Admin kanban view ── */
          tasks.length === 0 ? (
            <div className="ts-empty">
              <div className="ts-empty-icon">
                <ClipboardList size={18} color="#0d9488" strokeWidth={1.75} />
              </div>
              <p className="ts-empty-text">No tasks yet. Assign the first one!</p>
            </div>
          ) : (
            <div className="ts-kanban">
              {STATUS_COLS.map(({ key, label }) => {
                const col = tasks.filter((t) => t.status === key);
                return (
                  <div key={key} className="ts-col">
                    <div className="ts-col-header">
                      <div className="ts-col-label-row">
                        <div className="ts-dot" style={{ background: STATUS_DOT[key] }} />
                        <span className="ts-col-label">{label}</span>
                      </div>
                      <span className="ts-col-count">{col.length}</span>
                    </div>
                    {col.length === 0 ? (
                      <div style={{
                        background: "#fafbfc", border: "1.5px dashed #e2e8f0",
                        borderRadius: 12, padding: "20px 14px", textAlign: "center",
                      }}>
                        <p style={{ fontSize: 12, color: "#cbd5e1" }}>No tasks</p>
                      </div>
                    ) : (
                      col.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          isAdmin={isAdmin}
                          currentUserId={user?._id}
                          onDelete={handleDelete}
                          onStatusChange={handleStatusChange}
                          onReassign={handleReassign}
                        />
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          )

        ) : (
          /* ── Member view ── */
          <div>
            {/* Your tasks */}
            <div className="ts-group">
              <div className="ts-group-label">
                Your Tasks
                <span
                  className="ts-group-badge"
                  style={{ background: "rgba(13,148,136,0.1)", color: "#0d9488" }}
                >
                  {myTasks.length}
                </span>
              </div>
              {myTasks.length === 0 ? (
                <div className="ts-empty">
                  <p className="ts-empty-text">No tasks assigned to you yet.</p>
                </div>
              ) : (
                <div className="ts-grid">
                  {myTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      isAdmin={false}
                      currentUserId={user?._id}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                      onReassign={handleReassign}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Team tasks */}
            <div className="ts-group">
              <div className="ts-group-label">
                Team Tasks
                <span
                  className="ts-group-badge"
                  style={{ background: "#f1f5f9", color: "#64748b" }}
                >
                  {teamTasks.length}
                </span>
              </div>
              {teamTasks.length === 0 ? (
                <div className="ts-empty">
                  <p className="ts-empty-text">No other tasks assigned yet.</p>
                </div>
              ) : (
                <div className="ts-grid">
                  {teamTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      isAdmin={false}
                      currentUserId={user?._id}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                      onReassign={handleReassign}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <AssignTaskModal
            members={members}
            onClose={() => { setShowModal(false); setReassignTask(null); }}
            onSubmit={handleAssign}
            defaultTask={reassignTask}
          />
        )}
      </div>
    </>
  );
};

export default TaskSection;