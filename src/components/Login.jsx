import React, { useState } from "react";
import styled, { css } from "styled-components";
import { useGlobalContext } from "../context/GlobalContext";

const Container = styled.div`
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.8s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Heading = styled.h2`
  color: #fff;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const sharedInputStyles = css`
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  color: #000;
  box-sizing: border-box;
`;

const Input = styled.input`
  ${sharedInputStyles}

  &::placeholder {
    color: #444;
  }
`;

const Select = styled.select`
  ${sharedInputStyles}
  appearance: none;
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  background: rgba(0, 123, 255, 0.6);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: rgba(0, 123, 255, 0.8);
  }
`;

const Login = () => {
  const { setUser } = useGlobalContext();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("member");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) return;
    const newUser = { username, role };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <Container>
      <Heading>Login to Dashboard</Heading>
      <Form onSubmit={handleSubmit}>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="member">Team Member</option>
          <option value="admin">Admin</option>
        </Select>
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
};

export default Login;
