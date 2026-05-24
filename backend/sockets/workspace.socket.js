const registerWorkspacesocket = (io,socket)=>{
    socket.on("note-updated",(note)=>{
        io.to(note.workspace).emit("receive-note-update",note);
    });

    socket.on("typing",({workspaceId,user})=>{
        socket.to(workspaceId).emit("user-typing",user);
    });
};

module.exports = registerWorkspacesocket;