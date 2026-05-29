import { useEffect, useState, useRef } from "react";
import { X, CheckCircle, FileText, Users, Bell } from "lucide-react";
import { getWorkspaceActivities } from "../../api/workspace.api";
import toast from "react-hot-toast";

const ENTITY_ICON = {
  task: CheckCircle,
  note: FileText,
  workspace: Users,
};

const ENTITY_COLOR = {
  task: "bg-emerald-50 text-emerald-600",
  note: "bg-blue-50 text-blue-600",
  workspace: "bg-amber-50 text-amber-600",
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const ActivityPanel = ({ workspaceId, onClose, onSeen }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);

  useEffect(() => {
    fetchActivities();
    onSeen?.(); // Mark as seen when panel opens
  }, [workspaceId]);

  const fetchActivities = async () => {
    try {
      const data = await getWorkspaceActivities(workspaceId);
      setActivities(data);
    } catch {
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface border-l border-border shadow-2xl z-50 flex flex-col animate-slide-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-primary" />
            <h2 className="font-heading font-bold text-gray-900">Activity</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-gray-900 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Activities */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Bell size={20} className="text-primary" />
              </div>
              <p className="font-heading font-semibold text-gray-900 text-sm mb-1">
                No activity yet
              </p>
              <p className="text-muted text-xs">
                Actions like assigning tasks and adding notes will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {activities.map((activity, i) => {
                const Icon = ENTITY_ICON[activity.entityType] || Bell;
                const colorClass = ENTITY_COLOR[activity.entityType] || "bg-gray-50 text-gray-600";

                return (
                  <div
                    key={activity._id || i}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-background transition"
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon size={14} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 leading-snug">
                        <span className="font-heading font-semibold">
                          {activity.user?.name}
                        </span>
                        {" "}{activity.action}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {timeAgo(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs text-muted text-center">
            Showing last {activities.length} activities
          </p>
        </div>
      </div>
    </>
  );
};

export default ActivityPanel;