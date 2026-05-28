import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getWorkspaceTasks, createTask, updateTaskStatus, deleteTask } from "../../api/task.api";
import { getSocket } from "../../socket/socket";
import { useAuth } from "../../context/AuthContext";
import TaskCard from "./TaskCard";
import AssignTaskModal from "./AssignTaskModal";
import toast from "react-hot-toast";

const TaskSection = ({ workspaceId, members, isAdmin }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [reassignTask, setReassignTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [workspaceId]);

    // Socket listeners
    useEffect(() => {
        const socket = getSocket();

        socket.on("new-task", (task) => {
            setTasks((prev) => [...prev, task]);
        });
        socket.on("update-task", (updated) => {
            setTasks((prev) => prev.map((t) => t._id === updated._id ? updated : t));
        });
        socket.on("delete-task", (taskId) => {
            setTasks((prev) => prev.filter((t) => t._id !== taskId));
        });

        return () => {
            socket.off("new-task");
            socket.off("update-task");
            socket.off("delete-task");
        };
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
            const payload = {
                title: form.title,
                description: form.description,
                assignedTo: form.assignedTo,
                priority: form.priority,
                dueDate: form.dueDate,
                workspaceId: workspaceId,
            };
            
            const data = await createTask(payload);
            setTasks((prev) => [...prev, data]);
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
            setTasks((prev) => prev.map((t) => t._id === task._id ? updated : t));
            getSocket().emit("task-updated", updated);
        } catch {
            toast.error("Failed to update task");
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await deleteTask(taskId);
            setTasks((prev) => prev.filter((t) => t._id !== taskId));
            getSocket().emit("task-deleted", { taskId, workspaceId });
            toast.success("Task deleted");
        } catch {
            toast.error("Failed to delete task");
        }
    };

    const handleReassign = (task) => {
        setReassignTask(task);
        setShowModal(true);
    };

    // Split tasks
    const myTasks = tasks.filter((t) => t.assignedTo?._id === user?._id);
    const teamTasks = tasks.filter((t) => t.assignedTo?._id !== user?._id);

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
                <h2 className="font-heading text-xl font-bold text-gray-900">Tasks</h2>
                {isAdmin && (
                    <button
                        onClick={() => { setReassignTask(null); setShowModal(true); }}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-4 py-2 rounded-lg transition"
                    >
                        <Plus size={15} />
                        Assign Task
                    </button>
                )}
            </div>

            {/* Admin view — all tasks in one list */}
            {isAdmin ? (
                <div>
                    {tasks.length === 0 ? (
                        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
                            <p className="text-muted text-sm">No tasks yet. Assign the first one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    isAdmin={isAdmin}
                                    currentUserId={user?._id}
                                    onDelete={handleDelete}
                                    onStatusChange={handleStatusChange}
                                    onReassign={handleReassign}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                // Member view
                <div className="space-y-8">
                    {/* Your Tasks */}
                    <div>
                        <h3 className="font-heading font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                            Your Tasks
                            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                {myTasks.length}
                            </span>
                        </h3>
                        {myTasks.length === 0 ? (
                            <div className="bg-surface border border-border rounded-2xl p-6 text-center">
                                <p className="text-muted text-sm">No tasks assigned to you yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                    {/* Team Tasks */}
                    <div>
                        <h3 className="font-heading font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                            Team Tasks
                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                                {teamTasks.length}
                            </span>
                        </h3>
                        {teamTasks.length === 0 ? (
                            <div className="bg-surface border border-border rounded-2xl p-6 text-center">
                                <p className="text-muted text-sm">No other tasks assigned yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    );
};

export default TaskSection;