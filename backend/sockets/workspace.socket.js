const registerWorkspacesocket = (io, socket) => {
  socket.on("note-updated", (note) => {
    io.to(note.workspace).emit("receive-note-update", note);
  });

  socket.on("typing", ({ workspaceId, user }) => {
    socket.to(workspaceId).emit("user-typing", user);
  });

 socket.on("start-meet", ({ workspaceId, meetLink, startedBy }) => {
  io.to(workspaceId).emit("meet-started", { meetLink, startedBy });
});

  socket.on("meet-ended", ({ workspaceId }) => {
    io.to(workspaceId).emit("meet-ended");
  });
};

module.exports = registerWorkspacesocket;