const registerChatSocket = (io, socket) => {
  socket.on("send-message", (message) => {
    io.to(message.workspace).emit("receive-message", message);
  });
  
};

module.exports = registerChatSocket;