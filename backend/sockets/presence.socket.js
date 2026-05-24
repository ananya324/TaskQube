const onlineUsers = new Map();

const registerPresenceSocket = (io, socket) => {
    socket.on("user-online", (userId) => {
        onlineUsers.set(userId, socket.id);

        io.emit("online-users", Array.from(onlineUsers.keys()));
    });
    socket.on("disconnect",()=>{
        for(const[userId,socketId] of onlineUsers.entries()){
            if(socketId === socket.id){
                onlineUsers.delete(userId);
            }
        }
        io.emit("online-users" , Array.from(onlineUsers.keys()));
    });
};

module.exports = registerPresenceSocket;