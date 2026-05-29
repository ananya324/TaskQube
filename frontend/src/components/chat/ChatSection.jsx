import { useState, useEffect, useRef } from "react";
import { getWorkspaceMessages, createMessage } from "../../api/message.api";
import { getSocket } from "../../socket/socket";
import { useAuth } from "../../context/AuthContext";
import ChatBubble from "./ChatBubble";
import { MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const ChatSection = ({ workspaceId, onNewMessage, isActive }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [typingUser, setTypingUser] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeout = useRef(null);
    const notifiedRef = useRef(false);


    useEffect(() => {
        if (isActive) {
            notifiedRef.current = false;
        }
    }, [isActive]);
    useEffect(() => {
        fetchMessages();
    }, [workspaceId]);

    useEffect(() => {
        const socket = getSocket();

        // Join workspace room
        socket.emit("join-workspace", workspaceId);

        socket.on("receive-message", (message) => {
            setMessages((prev) => {
                if (prev.some((m) => m._id === message._id)) return prev;
                return [...prev, message];
            });

            if (message.sender?._id !== user?._id) {
                // One-time toast only
                if (!notifiedRef.current) {
                    notifiedRef.current = true;
                    toast(`💬 ${message.sender?.name} sent a message`, {
                        duration: 4000,
                    });
                }
                onNewMessage?.();
            }
        });

        socket.on("user-typing", (name) => {
            // Don't show yourself typing
            if (name !== user?.name) {
                setTypingUser(name);

                clearTimeout(typingTimeout.current);

                typingTimeout.current = setTimeout(() => {
                    setTypingUser(null);
                }, 2000);
            }
        });

        return () => {
            socket.emit("leave-workspace", workspaceId);

            socket.off("receive-message");
            socket.off("user-typing");

            clearTimeout(typingTimeout.current);
        };
    }, [workspaceId, user?._id]);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const data = await getWorkspaceMessages(workspaceId);
            setMessages(data);
        } catch {
            toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        try {
            const data = await createMessage({ workspaceId, content: input });
            setMessages((prev) => [...prev, data]);
            getSocket().emit("send-message", data);
            setInput("");
        } catch {
            toast.error("Failed to send message");
        }
    };

    const handleTyping = (e) => {
        setInput(e.target.value);
        getSocket().emit("typing", { workspaceId, user: user.name });
    };

    if (loading) {
        return (
            <div className="bg-surface border border-border rounded-2xl h-[60vh] animate-pulse" />
        );
    }

    return (
        <div>
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-6">Team Chat</h2>
            <div className="bg-surface border border-border rounded-2xl shadow-sm flex flex-col h-[60vh]">

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-16">
                            <MessageSquare size={32} className="text-muted mx-auto mb-3" />
                            <p className="text-muted text-sm">No messages yet. Say hello!</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <ChatBubble
                                key={msg._id || i}
                                message={msg}
                                isOwn={msg.sender?._id === user?._id}
                            />
                        ))
                    )}

                    {/* Typing indicator */}
                    {typingUser && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs text-primary font-bold">
                                    {typingUser?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="bg-background border border-border rounded-2xl rounded-bl-sm px-4 py-2.5">
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                            <span className="text-xs text-muted">{typingUser} is typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-border p-4">
                    <form onSubmit={handleSend} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={handleTyping}
                            placeholder="Type a message..."
                            className="flex-1 bg-background border border-border text-gray-900 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 transition"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-40"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatSection;