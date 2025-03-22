import React, { useEffect } from "react";
import io from "socket.io-client";
import { useGlobalContext } from "../context/GlobalContext";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { toast } from "react-toastify";
import Login from "./Login";
import styled from "styled-components";

const socket = io(process.env.REACT_APP_SOCKET_URL);

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(25px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: fadeIn 0.8s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Button = styled.button`
  margin-right: 1rem;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  color: inherit;
  cursor: pointer;
  font-weight: 500;
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 1rem;
  margin: 0.5rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

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
    <DashboardContainer>
      <h2>Welcome, {user.username} ({user.role})</h2>
      <div style={{ marginBottom: "1rem" }}>
        <Button onClick={logout}>Logout</Button>
        {/* <Button onClick={toggleTheme}>
          Switch to {theme === "light" ? "Dark" : "Light"} Theme
        </Button> */}
      </div>

      {user.role === "admin" && (
        <Section>
          <TaskForm socket={socket} user={user} />
          <h4>Users</h4>
          {users.map((u) => (
            <Card key={u.username}>
              {u.username} ({u.role})
              {u.username !== user.username && (
                <Button onClick={() => handleRemoveUser(u.username)}>
                  Remove
                </Button>
              )}
            </Card>
          ))}

          <h4>Online Now</h4>
          {onlineUsers.map((u) => (
            <Card key={u}>{u}</Card>
          ))}
        </Section>
      )}

      <TaskList socket={socket} user={user} />
    </DashboardContainer>
  );
};

export default TaskDashboard;
