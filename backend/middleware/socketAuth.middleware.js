const jwt = require("jsonwebtoken");

const socketAuth = (socket , next)=>{
    try{
        const token = socket.handshake.auth.token;
        if(!token){
            return next(new Error("Authentication error"));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        socket.user = decoded;
        next();
    }catch(error){
        next(new Error("Authentication error"));
    }
};

module.exports = socketAuth;

//protect → protects REST API routes
// socketAuth → protects realtime socket connections
// Both do similar JWT verification, but for different types of communication.