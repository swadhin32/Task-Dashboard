// src/App.js
import React from "react";
import { GlobalProvider } from "./context/GlobalContext";
import ThemeProviderWrapper from "./components/ThemeProviderWrapper";
import TaskDashboard from "./components/TaskDashboard";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProviderWrapper>
      <GlobalProvider>
        <TaskDashboard />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </GlobalProvider>
    </ThemeProviderWrapper>
  );
}

export default App;