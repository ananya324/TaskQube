const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const workspaceRoutes = require("./routes/workspace.routes")

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,

  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));//Allows backend to read form data.
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/workspaces",workspaceRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;