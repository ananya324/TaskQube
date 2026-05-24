const registerTaskSocket = (io,socket)=>{
    socket.on("join-workspace",(workspaceId)=>{
        socket.join(workspaceId);
        console.log(`Socket joined workspace: ${workspaceId}`);
    })

    socket.on("task-created",(task)=>{
        io.to(task.workspace).emit("new-task",task);
    });

    socket.on("task-updated",(task)=>{
        io.to(task.workspace).emit("update-task",task);
    });
    socket.on("task-deleted",({taskId,workspaceId})=>{
        io.to(workspaceId).emit("delete-task",taskId);
    });
};

module.exports = registerTaskSocket;