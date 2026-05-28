import { useState, useEffect } from "react";
import { Video, Link, X, Copy } from "lucide-react";
import { getSocket } from "../../socket/socket";
import toast from "react-hot-toast";

const MeetButton = ({ workspaceId, userName, isAdmin }) => {
    const [activeMeet, setActiveMeet] = useState(null);
    const [startedBy, setStartedBy] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [meetInput, setMeetInput] = useState("");

    useEffect(() => {
        const socket = getSocket();
        socket.emit("join-workspace", workspaceId);
    }, [workspaceId]);
    useEffect(() => {
        const socket = getSocket();

        socket.on("meet-started", ({ meetLink, startedBy }) => {
            setActiveMeet(meetLink);
            setStartedBy(startedBy);
            if (startedBy !== userName) {
                toast(`${startedBy} started a meeting!`, {
                    icon: "🎥",
                    duration: 6000,
                });
            }
        });

        socket.on("meet-ended", () => {
            setActiveMeet(null);
            setStartedBy(null);
        });

        return () => {
            socket.off("meet-started");
            socket.off("meet-ended");
        };
    }, [userName]);

    const handleStartMeet = () => {
        // Open Google Meet new meeting for admin to get the link
        window.open("https://meet.google.com/new", "_blank");
        setShowInput(true);
    };

    const handleShareLink = () => {
        if (!meetInput.trim()) return;

        const socket = getSocket();

        // Make sure we're in the room first
        socket.emit("join-workspace", workspaceId);

        setActiveMeet(meetInput);
        setStartedBy(userName);
        setShowInput(false);

        socket.emit("start-meet", {
            workspaceId,
            meetLink: meetInput,
            startedBy: userName,
        });

    };

    const handleJoinMeet = () => {
        if (activeMeet) window.open(activeMeet, "_blank");
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(activeMeet);
        toast.success("Meet link copied!");
    };

    const handleEndMeet = () => {
        setActiveMeet(null);
        setStartedBy(null);
        setMeetInput("");
        getSocket().emit("meet-ended", { workspaceId });
    };

    return (
        <div className="flex items-center gap-2">
            {/* Active meet banner */}
            {activeMeet && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-700 font-medium hidden sm:block">
                        Meet active
                    </span>
                    <button
                        onClick={handleJoinMeet}
                        className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-semibold px-2.5 py-1 rounded-md transition"
                    >
                        Join
                    </button>
                    <button
                        onClick={handleCopyLink}
                        className="text-emerald-600 hover:text-emerald-800 transition"
                    >
                        <Copy size={12} />
                    </button>
                    {isAdmin && (
                        <button
                            onClick={handleEndMeet}
                            className="text-muted hover:text-rose-500 transition"
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>
            )}

            {/* Admin — paste link input */}
            {showInput && isAdmin && (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={meetInput}
                        onChange={(e) => setMeetInput(e.target.value)}
                        placeholder="Paste meet link..."
                        className="bg-background border border-border text-gray-900 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary w-48"
                    />
                    <button
                        onClick={handleShareLink}
                        disabled={!meetInput.trim()}
                        className="text-xs bg-primary hover:bg-primary-hover text-white font-heading font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                    >
                        Share
                    </button>
                    <button
                        onClick={() => setShowInput(false)}
                        className="text-muted hover:text-gray-900 transition"
                    >
                        <X size={13} />
                    </button>
                </div>
            )}

            {/* Start Meet button — admin only */}
            {isAdmin && !activeMeet && !showInput && (
                <button
                    onClick={handleStartMeet}
                    className="flex items-center gap-2 border border-border bg-surface hover:bg-background text-gray-700 font-heading font-semibold text-sm px-3 py-1.5 rounded-lg transition"
                >
                    <Video size={14} className="text-primary" />
                    Start Meet
                </button>
            )}

            {/* Members see nothing until meet is active */}
            {!isAdmin && !activeMeet && (
                <div className="flex items-center gap-1.5 text-muted">
                    <Video size={14} />
                    <span className="text-xs">No active meet</span>
                </div>
            )}
        </div>
    );
};

export default MeetButton;