import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../socket/socket";
import { getWorkspaceById } from "../api/workspace.api";
import { ArrowLeft, Wifi, LayoutList, FileText, MessageSquare, Users } from "lucide-react";
import TaskSection from "../components/task/TaskSection";
import NoteSection from "../components/note/NoteSection";
import ChatSection from "../components/chat/ChatSection";
import MembersSection from "../components/members/MembersSection";
import MeetButton from "../components/meet/MeetButton";
import toast from "react-hot-toast";

const Workspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  const isAdmin = workspace?.owner?._id === user?._id;

  // Fetch workspace
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const data = await getWorkspaceById(id);
        setWorkspace(data);
      } catch {
        toast.error("Failed to load workspace");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspace();
  }, [id]);

  // Socket setup
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-workspace", id);
    socket.emit("user-online", user._id);

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online-users");
    };
  }, [id, user._id]);

  // Clear unread when chat tab is active
  useEffect(() => {
    if (activeTab === "chat") {
      setUnreadMessages(0);
    }
  }, [activeTab]);

  const handleNewMessage = () => {
    if (activeTab !== "chat") {
      setUnreadMessages((prev) => prev + 1);
    }
  };

  const TABS = [
    { key: "tasks", label: "Tasks", icon: LayoutList },
    { key: "notes", label: "Notes", icon: FileText },
    {
      key: "chat",
      label: "Chat",
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
    { key: "members", label: "Members", icon: Users },
  ];

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
      <nav className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-muted hover:text-gray-900 text-sm transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <span className="text-gray-300">|</span>
          <div>
            <span className="font-heading font-bold text-gray-900 text-lg">
              {workspace?.name}
            </span>
            {workspace?.description && (
              <p className="text-muted text-xs">{workspace.description}</p>
            )}

          </div>
        </div>


        {/* Online presence */}
        <div className="flex items-center gap-2">
          <MeetButton
            workspaceId={id}
            userName={user?.name}
            isAdmin={isAdmin}
          />
          <Wifi size={14} className="text-emerald-500" />
          <span className="text-xs text-muted">{onlineUsers.length} online</span>
          <div className="flex -space-x-2 ml-1">
            {onlineUsers.slice(0, 4).map((uid, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center border-2 border-surface font-heading font-semibold"
              >
                {uid?.charAt(0)?.toUpperCase() || "?"}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="border-b border-border bg-surface px-6 sticky top-[65px] z-10">
        <div className="flex gap-1 max-w-6xl mx-auto">
          {TABS.map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-heading font-medium border-b-2 transition ${activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-gray-700"
                }`}
            >
              <Icon size={15} />
              {label}
              {/* Unread badge */}
              {badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === "tasks" && (
          <TaskSection
            workspaceId={id}
            members={workspace?.members || []}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === "notes" && (
          <NoteSection workspaceId={id} />
        )}
        {activeTab === "chat" && (
          <ChatSection
            workspaceId={id}
            onNewMessage={handleNewMessage}
          />
        )}
        {activeTab === "members" && (
          <MembersSection
            workspace={workspace}
            onlineUsers={onlineUsers}
          />
        )}
      </main>
    </div>
  );
};

export default Workspace;