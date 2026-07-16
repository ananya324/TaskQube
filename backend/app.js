const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const workspaceRoutes = require("./routes/workspace.routes")
const taskRoutes = require("./routes/task.routes");
const noteRoutes = require("./routes/note.routes");
const reminderRoutes = require("./routes/reminder.routes");
const errorHandler = require("./middleware/error.middleware");
const apiLimiter = require("./middleware/rateLimit.middleware");
const aiRoutes = require("./routes/ai.routes");
const messageRoutes = require("./routes/message.routes");
const joinRequestRoutes = require("./routes/joinRequest.routes");



const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));//Allows backend to read form data.
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/reminders", reminderRoutes);
app.use(errorHandler);
app.use(apiLimiter);
app.use("/api/ai", aiRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/workspaces", joinRequestRoutes);




app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;