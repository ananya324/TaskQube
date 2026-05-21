require("dotenv").config();
// Because Socket.IO works best with a raw HTTP server.
const http = require("http");

const app = require("./app");
const connectDB = require("./config/db");

const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);
//Attaches Socket.IO to HTTP server.
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});