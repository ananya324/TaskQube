import { useEffect, useState } from "react";
import { Copy, Crown, Check, X, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getPendingRequests, acceptRequest, rejectRequest } from "../../api/joinRequest.api";
import { getSocket } from "../../socket/socket";
import toast from "react-hot-toast";

const MembersSection = ({ workspace, onlineUsers }) => {
  const { user } = useAuth();
  const isAdmin = workspace?.owner?._id === user?._id;
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    if (isAdmin && workspace?._id) {
      fetchRequests();
    }
  }, [isAdmin, workspace?._id]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("join-request", ({ request }) => {
      if (isAdmin) {
        setRequests((prev) => [...prev, request]);
        toast(`${request.user?.name} wants to join!`, { icon: "👋" });
      }
    });

    return () => {
      socket.off("join-request");
    };
  }, [isAdmin]);

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await getPendingRequests(workspace._id);
      setRequests(data);
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await acceptRequest(requestId);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      toast.success("Member accepted!");
    } catch {
      toast.error("Failed to accept request");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectRequest(requestId);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      toast.success("Request rejected");
    } catch {
      toast.error("Failed to reject request");
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(workspace?.roomCode);
    toast.success("Room code copied!");
  };

  return (
    <div className="max-w-xl">
      <h2 className="font-heading text-xl font-bold text-gray-900 mb-6">Members</h2>

      {/* Pending Requests — admin only */}
      {isAdmin && (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus size={15} className="text-primary" />
            <p className="text-sm font-heading font-semibold text-gray-700">
              Join Requests
            </p>
            {requests.length > 0 && (
              <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {requests.length} pending
              </span>
            )}
          </div>

          {loadingRequests ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-12 bg-background rounded-xl animate-pulse" />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <p className="text-muted text-sm text-center py-4">
              No pending requests
            </p>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="flex items-center gap-3 bg-background border border-border rounded-xl p-3"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-sm flex-shrink-0">
                    {request.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-gray-900 text-sm truncate">
                      {request.user?.name}
                    </p>
                    <p className="text-muted text-xs truncate">{request.user?.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAccept(request._id)}
                      className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      <Check size={12} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-heading font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      <X size={12} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Room Code — admin only */}
      {isAdmin && (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Crown size={14} className="text-amber-500" />
            <p className="text-sm font-heading font-semibold text-gray-700">
              Invite Code
            </p>
          </div>
          <p className="text-muted text-xs mb-4">
            Only you can see this. Share privately with teammates.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5">
              <span className="font-mono font-bold text-primary tracking-widest text-sm">
                {workspace?.roomCode || "Loading..."}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-4 py-2.5 rounded-lg transition"
            >
              <Copy size={13} />
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <p className="text-sm font-heading font-semibold text-gray-700 mb-4">
          {workspace?.members?.length || 0} Members
        </p>
        <div className="space-y-3">
          {workspace?.members?.map((member, i) => {
            const isOnline = onlineUsers.includes(member._id);
            const isOwner = member._id === workspace?.owner?._id;
            const isMe = member._id === user?._id;

            return (
              <div
                key={member._id || i}
                className="flex items-center gap-3 py-3 border-b border-border last:border-0"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-sm">
                    {member?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface ${
                    isOnline ? "bg-emerald-500" : "bg-gray-300"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-semibold text-gray-900 text-sm truncate">
                      {member?.name}
                    </p>
                    {isOwner && (
                      <Crown size={11} className="text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-muted text-xs truncate">{member?.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isOnline ? (
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full">
                      Online
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">
                      Offline
                    </span>
                  )}
                  {isMe && (
                    <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                  {isOwner && (
                    <span className="text-xs bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MembersSection;