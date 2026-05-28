import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkspaceTasks, createTask, updateTaskStatus, deleteTask } from "../api/task.api";
import { getWorkspaceNotes, createNote } from "../api/note.api";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../socket/socket";
import toast from "react-hot-toast";
import { getWorkspaceById } from "../api/workspace.api";
import { getWorkspaceMessages, createMessage } from "../api/message.api";

import {
  ArrowLeft, Plus, Trash2, Users, FileText,
  Kanban, Circle, Timer, CheckCircle2, Wifi, MessageSquare,
} from "lucide-react";

const TASK_COLUMNS = [
  { key: "todo", label: "To Do", icon: Circle, color: "text-gray-400" },
  { key: "in-progress", label: "In Progress", icon: Timer, color: "text-amber-500" },
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "text-emerald-500" },
];

const TABS = [
  { key: "tasks", label: "Tasks", icon: Kanban },
  { key: "notes", label: "Notes", icon: FileText },
  { key: "members", label: "Members", icon: Users },
  { key: "chat", label: "Chat", icon: MessageSquare },
];

const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-600",
};

const Workspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [workspace, setWorkspace] = useState(null);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    workspace: id,
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, notesData, workspaceData, messagesData] = await Promise.all([
          getWorkspaceTasks(id),
          getWorkspaceNotes(id),
          getWorkspaceById(id),
          getWorkspaceMessages(id),
        ]);

        setMessages(messagesData);
        setTasks(tasksData.tasks || tasksData);
        setNotes(notesData.notes || notesData);
        setWorkspace(workspaceData);

        const notesList = notesData.notes || notesData;
        if (notesList?.[0]) {
          setNoteContent(notesList[0].content || "");
        }
      } catch {
        toast.error("Failed to load workspace data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Socket setup
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-workspace", id);
    socket.emit("user-online", user._id);

    socket.on("new-task", (task) => {
      setTasks((prev) => [...prev, task]);
    });
    socket.on("update-task", (updated) => {
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    });
    socket.on("delete-task", (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });
    socket.on("receive-note-update", (note) => {
      setNoteContent(note.content);
    });
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });
    socket.on("user-typing", (u) => {
      setTypingUser(u);
      setTimeout(() => setTypingUser(null), 2000);
    });
    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("new-task");
      socket.off("update-task");
      socket.off("delete-task");
      socket.off("receive-note-update");
      socket.off("online-users");
      socket.off("user-typing");
      socket.off("receive-message");
    };
  }, [id, user._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create task — skip local setTasks; socket "new-task" handles the update
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await createTask({ ...taskForm, workspace: id });
      const newTask = data.task || data;
      getSocket().emit("task-created", newTask);
      toast.success("Task created!");
      setShowCreateTask(false);
      setTaskForm({ title: "", description: "", priority: "medium", dueDate: "", workspace: id });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    try {
      const data = await createMessage({ workspaceId: id, content: messageInput });
      getSocket().emit("send-message", data);
      setMessageInput("");
      // "receive-message" socket event handles appending to state
    } catch {
      toast.error("Failed to send message");
    }
  };

  // Update task status — skip local setTasks; socket "update-task" handles the update
  const handleStatusChange = async (task, newStatus) => {
    try {
      const data = await updateTaskStatus(task._id, newStatus);
      const updated = { ...task, status: newStatus, ...data?.task };
      getSocket().emit("task-updated", updated);
    } catch {
      toast.error("Failed to update task");
    }
  };

  // Delete task — skip local setTasks; socket "delete-task" handles the update
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      getSocket().emit("task-deleted", { taskId, workspaceId: id });
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleNoteSave = async () => {
    setSubmitting(true);
    try {
      const data = await createNote({ workspace: id, content: noteContent });
      const note = data.note || data;
      getSocket().emit("note-updated", note);
      toast.success("Note saved!");
    } catch {
      toast.error("Failed to save note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNoteTyping = (e) => {
    setNoteContent(e.target.value);
    getSocket().emit("typing", { workspaceId: id, user: user.name });
  };

  const inputClass =
    "w-full bg-background border border-border text-gray-900 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 transition";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted text-sm">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <nav className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-muted hover:text-gray-900 text-sm transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <span className="text-gray-300">|</span>
          <span className="font-heading font-bold text-primary text-xl">TaskQube</span>
        </div>

        <div className="flex items-center gap-2">
          <Wifi size={14} className="text-emerald-500" />
          <span className="text-xs text-muted">{onlineUsers.length} online</span>
          <div className="flex -space-x-2 ml-1">
            {onlineUsers.slice(0, 4).map((uid, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-primary text-white text-xs flex items-center justify-center border-2 border-surface font-heading font-semibold"
              >
                {uid?.charAt(0)?.toUpperCase() || "?"}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="border-b border-border bg-surface px-6">
        <div className="flex gap-1 max-w-5xl mx-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-heading font-medium border-b-2 transition ${activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-gray-700"
                }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-gray-900">Task Board</h2>
              <button
                onClick={() => setShowCreateTask(!showCreateTask)}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-4 py-2 rounded-lg transition"
              >
                <Plus size={15} />
                Add Task
              </button>
            </div>

            {/* Create Task Form */}
            {showCreateTask && (
              <div className="bg-surface border border-border rounded-2xl p-6 mb-6 shadow-sm">
                <h3 className="font-heading font-semibold text-gray-900 mb-4">New Task</h3>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    required
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className={inputClass}
                  />
                  <div className="flex gap-3">
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className={inputClass}
                    >
                      <option value="low">Low priority</option>
                      <option value="medium">Medium priority</option>
                      <option value="high">High priority</option>
                    </select>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-5 py-2 rounded-lg transition disabled:opacity-50"
                    >
                      {submitting ? "Creating..." : "Create Task"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateTask(false)}
                      className="border border-border text-gray-600 font-heading font-medium text-sm px-5 py-2 rounded-lg hover:bg-background transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TASK_COLUMNS.map(({ key, label, icon: Icon, color }) => {
                const columnTasks = tasks.filter((t) => t.status === key);
                return (
                  <div key={key} className="bg-surface border border-border rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon size={16} className={color} />
                      <span className="font-heading font-semibold text-gray-800 text-sm">{label}</span>
                      <span className="ml-auto bg-background text-muted text-xs font-medium px-2 py-0.5 rounded-full">
                        {columnTasks.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {columnTasks.length === 0 ? (
                        <p className="text-muted text-xs text-center py-6">No tasks</p>
                      ) : (
                        columnTasks.map((task) => (
                          <div
                            key={task._id}
                            className="bg-background border border-border rounded-xl p-4 group hover:border-primary/30 transition"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="font-heading font-semibold text-gray-900 text-sm leading-snug">
                                {task.title}
                              </p>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="opacity-0 group-hover:opacity-100 text-muted hover:text-rose-500 transition"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            {task.description && (
                              <p className="text-muted text-xs mb-3 line-clamp-2">{task.description}</p>
                            )}

                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}>
                                {task.priority}
                              </span>
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task, e.target.value)}
                                className="text-xs text-muted bg-transparent border-none outline-none cursor-pointer"
                              >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>

                            {task.dueDate && (
                              <p className="text-xs text-muted mt-2">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-gray-900">Shared Notes</h2>
              {typingUser && (
                <span className="text-xs text-muted italic">{typingUser} is typing...</span>
              )}
            </div>
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <textarea
                value={noteContent}
                onChange={handleNoteTyping}
                placeholder="Start typing your shared notes here... All team members can see this in real time."
                rows={16}
                className="w-full bg-background border border-border text-gray-900 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 transition resize-none font-sans"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleNoteSave}
                  disabled={submitting}
                  className="bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-5 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Note"}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="max-w-3xl">
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-6">Team Chat</h2>
            <div className="bg-surface border border-border rounded-2xl shadow-sm flex flex-col h-[60vh]">

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <MessageSquare size={32} className="text-muted mx-auto mb-3" />
                    <p className="text-muted text-sm">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isOwn = msg.sender?._id === user?._id || msg.sender === user?._id;
                    return (
                      <div key={msg._id || i} className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-xs flex-shrink-0">
                          {msg.sender?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className={`max-w-xs lg:max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                          {!isOwn && (
                            <span className="text-xs text-muted font-medium px-1">{msg.sender?.name}</span>
                          )}
                          <div className={`px-4 py-2.5 rounded-2xl text-sm ${isOwn
                              ? "bg-primary text-white rounded-br-sm"
                              : "bg-background border border-border text-gray-900 rounded-bl-sm"
                            }`}>
                            {msg.content}
                          </div>
                          <span className="text-xs text-muted px-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                {typingUser && (
                  <p className="text-xs text-muted italic">{typingUser} is typing...</p>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-border p-4">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      getSocket().emit("typing", { workspaceId: id, user: user.name });
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-background border border-border text-gray-900 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-40"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="max-w-xl">
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-6">Members</h2>

            {user?._id === workspace?.owner?._id && (
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm mb-4">
                <p className="text-sm font-heading font-semibold text-gray-700 mb-1">Invite Code</p>
                <p className="text-muted text-xs mb-3">Share this code with teammates to join this workspace.</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5">
                    <span className="font-mono font-bold text-primary tracking-widest text-sm">
                      {workspace?.roomCode || "Loading..."}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(workspace?.roomCode);
                      toast.success("Code copied!");
                    }}
                    className="bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-4 py-2.5 rounded-lg transition"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-3">
              <p className="text-sm font-heading font-semibold text-gray-700 mb-2">
                {workspace?.members?.length || 0} Members
              </p>
              {workspace?.members?.map((member, i) => (
                <div key={member._id || i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-sm">
                    {member?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-gray-900 text-sm">{member?.name}</p>
                    <p className="text-muted text-xs">{member?.email}</p>
                  </div>
                  {member?._id === workspace?.owner?._id && (
                    <span className="ml-auto text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">
                      Owner
                    </span>
                  )}
                  {member?._id === user?._id && member?._id !== workspace?.owner?._id && (
                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 font-medium px-2.5 py-1 rounded-full">
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}



      </main>
    </div>
  );
};

export default Workspace;