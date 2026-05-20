const { Server } = require("socket.io");

//Stores the Socket.IO instance globally inside this file.
let io;
//The server is your HTTP server.
const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log(`User connectes: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${socket.id}`);
        });
    });
    return io;
};
//This function is simply a safe way to access the Socket.IO instance from other files.
const getIO =()=>{
    if(!io){
        throw new Error("Socket.io not initialized");
    }
    return io;
};

module.exports = {initSocket ,getIO};