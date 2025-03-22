import React, { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";

const Login = () => {
  const { setUser } = useGlobalContext();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("team");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    const newUser = { username, role };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-2">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="team">Team Member</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;