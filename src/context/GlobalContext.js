import React, { createContext, useContext, useState, useEffect } from "react";
import styled from "styled-components";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlassWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme === "dark" ? "#fff" : "#000"};
  transition: all 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const GlobalProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setTasks([]);
    setUsers([]);
    setOnlineUsers([]);
    setNotifications([]);
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <GlobalContext.Provider
      value={{
        tasks,
        setTasks,
        notifications,
        setNotifications,
        user,
        setUser,
        users,
        setUsers,
        onlineUsers,
        setOnlineUsers,
        logout,
        theme,
        toggleTheme,
      }}
    >
      <GlassWrapper theme={theme}>{children}</GlassWrapper>
    </GlobalContext.Provider>
  );
};
