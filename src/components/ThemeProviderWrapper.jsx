import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../theme";

const Wrapper = styled.div`
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
  min-height: 100vh;
  padding: 20px;
`;

const Button = styled.button`
  margin-right: 1rem;
  background: rgba(255, 255, 255, 0.7);
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

const ThemeProviderWrapper = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <Wrapper>
        <Button onClick={toggleTheme} style={{ marginBottom: "1rem" }}>
          Toggle Theme
        </Button>
        {children}
      </Wrapper>
    </ThemeProvider>
  );
};

export default ThemeProviderWrapper;