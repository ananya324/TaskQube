const ChatBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-xs flex-shrink-0">
        {message.sender?.name?.charAt(0).toUpperCase() || "?"}
      </div>

      {/* Bubble */}
      <div className={`max-w-xs lg:max-w-md flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && (
          <span className="text-xs text-muted font-medium px-1">{message.sender?.name}</span>
        )}
        <div className={`px-4 py-2.5 rounded-2xl text-sm ${
          isOwn
            ? "bg-primary text-white rounded-br-sm"
            : "bg-background border border-border text-gray-900 rounded-bl-sm"
        }`}>
          {message.content}
        </div>
        <span className="text-xs text-muted px-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;