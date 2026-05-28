
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserWorkspaces, createWorkspace, joinWorkspace } from "../api/workspace.api";
import { useAuth } from "../context/AuthContext";
import { useWorkspace } from "../context/WorkspaceContext";
import toast from "react-hot-toast";
import { Plus, LogIn, Users, ChevronRight, LogOut, LayoutGrid } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { setWorkspaces, workspaces } = useWorkspace();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const [joinCode, setJoinCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const data = await getUserWorkspaces();
      setWorkspaces(data.workspaces || data);
    } catch {
      toast.error("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await createWorkspace(createForm);
      setWorkspaces((prev) => [...prev, data.workspace || data]);
      toast.success("Workspace created!");
      setShowCreate(false);
      setCreateForm({ name: "", description: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create workspace");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await joinWorkspace({ roomCode: joinCode });
      setWorkspaces((prev) => [...prev, data.workspace || data]);
      toast.success("Joined workspace!");
      setShowJoin(false);
      setJoinCode("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid room code");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-background border border-border text-gray-900 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 transition";

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <nav className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="font-heading text-xl font-bold text-primary">TaskQube</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-heading font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-gray-900 transition"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <LayoutGrid size={20} className="text-primary" />
            <h1 className="font-heading text-2xl font-bold text-gray-900">Your Workspaces</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowJoin(true); setShowCreate(false); }}
              className="flex items-center gap-2 border border-border bg-surface text-gray-700 hover:bg-background font-heading font-semibold text-sm px-4 py-2 rounded-lg transition"
            >
              <LogIn size={15} />
              Join with Code
            </button>
            <button
              onClick={() => { setShowCreate(true); setShowJoin(false); }}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-4 py-2 rounded-lg transition"
            >
              <Plus size={15} />
              New Workspace
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="bg-surface border border-border rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-gray-900 mb-4">Create a workspace</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Workspace name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                required
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                className={inputClass}
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-5 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="border border-border text-gray-600 font-heading font-medium text-sm px-5 py-2 rounded-lg hover:bg-background transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Join Form */}
        {showJoin && (
          <div className="bg-surface border border-border rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-gray-900 mb-4">Join a workspace</h2>
            <form onSubmit={handleJoin} className="space-y-4">
              <input
                type="text"
                placeholder="Enter room code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                required
                className={inputClass}
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-5 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? "Joining..." : "Join"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJoin(false)}
                  className="border border-border text-gray-600 font-heading font-medium text-sm px-5 py-2 rounded-lg hover:bg-background transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Workspaces Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-6 animate-pulse h-36" />
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-1">No workspaces yet</h3>
            <p className="text-muted text-sm">Create a new workspace or join one with a room code.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((ws) => (
              <div
                key={ws._id}
                onClick={() => navigate(`/workspace/${ws._id}`)}
                className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 cursor-pointer transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="font-heading font-bold text-primary text-lg">
                      {ws.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-muted group-hover:text-primary transition" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mb-1">{ws.name}</h3>
                <p className="text-muted text-sm line-clamp-2">{ws.description || "No description"}</p>
                <div className="flex items-center gap-1.5 mt-4">
                  <Users size={13} className="text-muted" />
                  <span className="text-xs text-muted">{ws.members?.length || 0} members</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;