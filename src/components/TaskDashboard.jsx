import React, { useEffect } from "react";
import io from "socket.io-client";
import { useGlobalContext } from "../context/GlobalContext";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { toast } from "react-toastify";
import Login from "./Login";

const socket = io("http://localhost:5000");

const TaskDashboard = () => {
  const {
    user,
    setTasks,
    setNotifications,
    users,
    setUsers,
    onlineUsers,
    setOnlineUsers,
    logout,
    theme,
    toggleTheme,
  } = useGlobalContext();

  useEffect(() => {
    if (!user) return;

    socket.on("loadTasks", (loadedTasks) => setTasks(loadedTasks));
    socket.on("taskUpdated", (updatedTasks) => setTasks(updatedTasks));
    socket.on("userNotified", (msg) => {
      setNotifications((prev) => [...prev, msg]);
      toast.info(msg);
    });
    socket.on("loadUsers", (userList) => setUsers(userList));
    socket.on("onlineUsers", (list) => setOnlineUsers(list));

    socket.emit("registerUser", user);

    return () => socket.disconnect();
  }, [setTasks, setNotifications, user, setUsers, setOnlineUsers]);

  const handleRemoveUser = (username) => {
    socket.emit("removeUser", username);
  };

  if (!user) return <Login />;

  return (
    <div>
      <h2>Welcome, {user.username} ({user.role})</h2>
      <button onClick={logout} style={{ marginRight: "1rem" }}>Logout</button>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Theme
      </button>

      {user.role === "admin" && (
        <>
          <TaskForm socket={socket} user={user} />
          <div>
            <h4>Users</h4>
            <ul>
              {users.map((u) => (
                <li key={u.username}>
                  {u.username} ({u.role})
                  {u.username !== user.username && (
                    <button onClick={() => handleRemoveUser(u.username)}>
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <h4>Online Now</h4>
            <ul>
              {onlineUsers.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      <TaskList socket={socket} user={user} />
    </div>
  );
};

export default TaskDashboard;