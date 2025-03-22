import React, { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [users, setUsers] = useState([]); // for admin
  const [onlineUsers, setOnlineUsers] = useState([]); // for display
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
      {children}
    </GlobalContext.Provider>
  );
};
