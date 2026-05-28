const { Server } = require("socket.io");
const registerTaskSocket = require("../sockets/task.socket");
const registerPresenceSocket = require("../sockets/presence.socket");
const registerWorkspaceSocket = require("../sockets/workspace.socket");
const socketAuth = require("../middleware/socketAuth.middleware");
const registerChatSocket = require("../sockets/chat.socket");


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
    io.use(socketAuth);
    io.on("connection", (socket) => {
        console.log(`User connectes: ${socket.id}`);
        registerTaskSocket(io, socket);
        registerPresenceSocket(io, socket);
        registerWorkspaceSocket(io, socket);
        registerChatSocket(io, socket);


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