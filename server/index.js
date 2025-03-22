const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

let tasks = [];
let users = [];
let activeSockets = {}; // ✅ moved to global so it persists across socket events

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send existing tasks and users
  socket.emit("loadTasks", tasks);
  socket.emit("loadUsers", users);

  socket.on("registerUser", (user) => {
    activeSockets[socket.id] = user.username;
    if (!users.find((u) => u.username === user.username)) {
      users.push(user); // Avoid duplicate users
    }
    io.emit("loadUsers", users);
    updateOnlineUsers();
  });

  socket.on("disconnect", () => {
    delete activeSockets[socket.id];
    updateOnlineUsers();
  });

  function updateOnlineUsers() {
    const list = Object.values(activeSockets);
    io.emit("onlineUsers", list);
  }

  // Handle new task
  socket.on("addTask", (task) => {
    tasks.push(task);
    io.emit("taskUpdated", tasks);
    io.emit("userNotified", `Task '${task.title}' assigned to ${task.assignee}`);
  });

  // Handle task update
  socket.on("updateTask", (updated) => {
    tasks = tasks.map((t) => (t.id === updated.id ? updated : t));
    io.emit("taskUpdated", tasks);
    io.emit("userNotified", `Task '${updated.title}' was updated.`);
  });

  // Handle task delete
  socket.on("deleteTask", (id) => {
    tasks = tasks.filter((t) => t.id !== id);
    io.emit("taskUpdated", tasks);
  });

  // Remove user (admin only)
  socket.on("removeUser", (username) => {
    users = users.filter((u) => u.username !== username);
    io.emit("loadUsers", users);
    io.emit("userNotified", `${username} was removed from the dashboard`);
  });
});

// ✅ Automatically use Render’s assigned port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
