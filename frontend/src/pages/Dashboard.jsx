import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserWorkspaces, createWorkspace, joinWorkspace } from "../api/workspace.api";
import { useAuth } from "../context/AuthContext";
import { useWorkspace } from "../context/WorkspaceContext";
import toast from "react-hot-toast";
import { Plus, LogIn, Users, ChevronRight, LogOut, LayoutGrid, X } from "lucide-react";
import { requestToJoin } from "../api/joinRequest.api";
import { getSocket } from "../socket/socket";
import { useAuth } from "../context/AuthContext";



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

  useEffect(() => { fetchWorkspaces(); }, []);

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
      const data = await requestToJoin(joinCode);
      toast.success(data.message);
      setShowJoin(false);
      setJoinCode("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid room code");
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const socket = getSocket();

    socket.on("join-request-response", ({ userId, status, workspace }) => {
      if (userId === user?._id) {
        if (status === "accepted") {
          toast.success(`You have been accepted into ${workspace.name}!`);
          setWorkspaces((prev) => [...prev, workspace]);
        } else {
          toast.error(`Your request to join ${workspace.name} was rejected.`);
        }
      }
    });

    return () => {
      socket.off("join-request-response");
    };
  }, [user?._id]);

  // Teal palette colours for workspace avatars
  const AVATAR_COLORS = [
    "#0d9488", "#0891b2", "#0e7490", "#047857", "#0f766e",
    "#1d4ed8", "#7c3aed", "#b45309", "#be185d",
  ];
  const avatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdfa", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0f172a" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* NAV */
        .db-nav {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 40px;
          height: 60px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
        }
        .db-logo {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800; font-size: 19px; letter-spacing: -0.5px; color: #0d9488;
        }
        .db-nav-right { display: flex; align-items: center; gap: 16px; }
        .db-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: #0d9488; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 14px;
          flex-shrink: 0;
        }
        .db-username { font-size: 14px; font-weight: 600; color: #334155; }
        .db-logout {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 500;
          color: #94a3b8; padding: 6px 10px; border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .db-logout:hover { color: #0f766e; background: rgba(13,148,136,0.07); }

        /* MAIN */
        .db-main { max-width: 1080px; margin: 0 auto; padding: 44px 24px 80px; }

        /* PAGE HEADER */
        .db-page-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 32px; gap: 12px; flex-wrap: wrap;
        }
        .db-page-title-row { display: flex; align-items: center; gap: 10px; }
        .db-page-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: rgba(13,148,136,0.1);
          display: flex; align-items: center; justify-content: center;
        }
        .db-page-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a;
        }
        .db-actions { display: flex; align-items: center; gap: 10px; }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 7px;
          background: #fff; border: 1.5px solid #e2e8f0; color: #334155;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;
          padding: 8px 16px; border-radius: 10px; cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .btn-outline:hover { border-color: #2d8a81; box-shadow: 0 2px 10px rgba(13,148,136,0.1); background: #f0fdfa; }

        .btn-solid {
          display: inline-flex; align-items: center; gap: 7px;
          background: #0d9488; color: #fff; border: none;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700;
          padding: 9px 18px; border-radius: 10px; cursor: pointer;
          box-shadow: 0 2px 12px rgba(13,148,136,0.25);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-solid:hover { background: #0f766e; transform: translateY(-1px); box-shadow: 0 4px 18px rgba(13,148,136,0.32); }

        /* FORM PANEL */
        .form-panel {
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 18px;
          padding: 28px; margin-bottom: 24px;
          animation: slideDown 0.22s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .form-panel-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
        }
        .form-panel-title {
          font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700; color: #0f172a;
        }
        .close-btn {
          background: none; border: none; cursor: pointer; color: #94a3b8;
          border-radius: 8px; padding: 4px; display: flex; align-items: center;
          transition: color 0.15s, background 0.15s;
        }
        .close-btn:hover { color: #0f172a; background: #f1f5f9; }

        .db-input {
          width: 100%; background: #f8fafc; border: 1.5px solid #e2e8f0; color: #0f172a;
          border-radius: 10px; padding: 10px 14px; font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 12px;
        }
        .db-input:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); background: #fff; }
        .db-input::placeholder { color: #94a3b8; }

        .form-actions { display: flex; gap: 10px; margin-top: 4px; }

        .btn-submit {
          background: #0d9488; color: #fff; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700;
          padding: 9px 22px; border-radius: 9px;
          transition: background 0.2s; box-shadow: 0 2px 10px rgba(13,148,136,0.2);
        }
        .btn-submit:hover:not(:disabled) { background: #0f766e; }
        .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-cancel {
          background: none; border: 1.5px solid #e2e8f0; color: #64748b; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;
          padding: 9px 20px; border-radius: 9px;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-cancel:hover { border-color: #cbd5e1; color: #334155; }

        /* GRID */
        .ws-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) { .ws-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .ws-grid { grid-template-columns: 1fr; } }

        /* WORKSPACE CARD */
        .ws-card {
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 18px;
          padding: 22px 22px 20px; cursor: pointer;
          transition: box-shadow 0.2s, transform 0.2s;
          animation: fadeUp 0.4s cubic-bezier(.16,1,.3,1) both;
        }
        .ws-card:hover { box-shadow: 0 6px 24px rgba(13,148,136,0.1); transform: translateY(-2px); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ws-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
        .ws-initials {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 17px; color: #fff;
        }
        .ws-chevron { color: #cbd5e1; transition: color 0.2s, transform 0.2s; }
        .ws-card:hover .ws-chevron { color: #0d9488; transform: translateX(2px); }

        .ws-name {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 6px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ws-desc {
          font-size: 13px; color: #64748b; line-height: 1.6;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          min-height: 40px;
        }
        .ws-footer {
          display: flex; align-items: center; gap: 5px;
          margin-top: 16px; padding-top: 14px; border-top: 1px solid #f1f5f9;
        }
        .ws-members { font-size: 12px; color: #94a3b8; font-weight: 500; }

        /* SKELETON */
        .ws-skeleton {
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 18px;
          padding: 22px; height: 152px;
          animation: shimmer 1.4s ease-in-out infinite;
          background: linear-gradient(90deg, #f1f5f9 25%, #e8f5f4 50%, #f1f5f9 75%);
          background-size: 200% 100%;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* EMPTY STATE */
        .empty-state { text-align: center; padding: 80px 24px; }
        .empty-icon {
          width: 56px; height: 56px; border-radius: 16px; background: rgba(13,148,136,0.08);
          display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
        }
        .empty-title {
          font-family: 'Bricolage Grotesque', sans-serif; font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 6px;
        }
        .empty-sub { font-size: 14px; color: #94a3b8; }
      `}</style>

      {/* NAV */}
      <nav className="db-nav">
        <span className="db-logo">TaskQube</span>
        <div className="db-nav-right">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="db-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <span className="db-username">{user?.name}</span>
          </div>
          <button className="db-logout" onClick={logout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="db-main">

        {/* Page header */}
        <div className="db-page-header">
          <div className="db-page-title-row">
            <div className="db-page-icon">
              <LayoutGrid size={18} color="#0d9488" strokeWidth={2} />
            </div>
            <h1 className="db-page-title">Your Workspaces</h1>
          </div>
          <div className="db-actions">
            <button
              className="btn-outline"
              onClick={() => { setShowJoin(true); setShowCreate(false); }}
            >
              <LogIn size={14} /> Join with Code
            </button>
            <button
              className="btn-solid"
              onClick={() => { setShowCreate(true); setShowJoin(false); }}
            >
              <Plus size={14} /> New Workspace
            </button>
          </div>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="form-panel">
            <div className="form-panel-header">
              <span className="form-panel-title">Create a workspace</span>
              <button className="close-btn" onClick={() => setShowCreate(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <input
                className="db-input"
                type="text"
                placeholder="Workspace name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                required
              />
              <input
                className="db-input"
                type="text"
                placeholder="Description (optional)"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              />
              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? "Creating…" : "Create workspace"}
                </button>
                <button type="button" className="btn-cancel" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Join form */}
        {showJoin && (
          <div className="form-panel">
            <div className="form-panel-header">
              <span className="form-panel-title">Join a workspace</span>
              <button className="close-btn" onClick={() => setShowJoin(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleJoin}>
              <input
                className="db-input"
                type="text"
                placeholder="Enter room code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                required
              />
              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? "Joining…" : "Join workspace"}
                </button>
                <button type="button" className="btn-cancel" onClick={() => setShowJoin(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Workspace grid */}
        {loading ? (
          <div className="ws-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="ws-skeleton" />)}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={22} color="#0d9488" strokeWidth={1.75} />
            </div>
            <div className="empty-title">No workspaces yet</div>
            <p className="empty-sub">Create a new workspace or join one with a room code.</p>
          </div>
        ) : (
          <div className="ws-grid">
            {workspaces.map((ws, i) => (
              <div
                key={ws._id}
                className="ws-card"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => navigate(`/workspace/${ws._id}`)}
              >
                <div className="ws-card-top">
                  <div className="ws-initials" style={{ background: avatarColor(ws.name) }}>
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronRight size={16} className="ws-chevron" />
                </div>
                <div className="ws-name">{ws.name}</div>
                <div className="ws-desc">{ws.description || "No description provided."}</div>
                <div className="ws-footer">
                  <Users size={13} color="#94a3b8" strokeWidth={2} />
                  <span className="ws-members">{ws.members?.length || 0} member{ws.members?.length !== 1 ? "s" : ""}</span>
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
