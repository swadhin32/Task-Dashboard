import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const ListContainer = styled.div`
  margin-top: 2rem;
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  background: ${(props) => (props.active ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.2)")};
  color: ${(props) => props.theme.text};
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
`;

const SearchInput = styled.input`
  margin: 1rem auto;
  display: block;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: ${(props) => props.theme.inputText};
  width: 80%;
  max-width: 400px;
  backdrop-filter: blur(6px);

  &::placeholder {
    color: ${(props) => props.theme.placeholder};
  }
`;

const Card = styled.div`
  background: ${(props) => props.theme.cardBg};
  backdrop-filter: blur(18px);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, opacity 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: fadeIn 0.4s ease forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-4px);
  }
`;

const TaskInfo = styled.div`
  flex-grow: 1;
`;

const TaskTitle = styled.h4`
  margin: 0;
  font-size: 1.2rem;
  color: ${(props) => props.theme.text};
`;

const TaskMeta = styled.p`
  margin: 0.3rem 0;
  font-size: 0.95rem;
  color: ${(props) => props.theme.text};
`;

const StatusTag = styled.span`
  display: inline-block;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 12px;
  color: white;
  background-color: ${(props) =>
    props.status === "Completed"
      ? "rgba(40, 167, 69, 0.6)"
      : "rgba(255, 193, 7, 0.6)"};
  backdrop-filter: blur(10px);
  cursor: pointer;
`;

const Assignee = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.text};
  font-size: 0.95rem;
`;

const ButtonGroup = styled.div`
  margin-top: 0.6rem;
`;

const Button = styled.button`
  margin-right: 0.5rem;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  background: rgba(0, 123, 255, 0.6);
  color: ${(props) => props.theme.buttonText};
  cursor: pointer;
  transition: background 0.3s, transform 0.2s ease;

  &:hover {
    background: rgba(0, 123, 255, 0.8);
    transform: scale(1.05);
  }
`;

const TaskList = ({ socket, user }) => {
  const [editingId, setEditingId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    socket.on("taskUpdated", (updatedTasks) => {
      setTasks(updatedTasks);
    });

    socket.on("userNotified", (msg) => {
      toast(msg, { position: "top-right", autoClose: 3000 });
    });
  }, [socket]);

  const handleEdit = (taskId) => {
    setEditingId(taskId);
  };

  const handleDelete = (taskId) => {
    socket.emit("deleteTask", taskId);
  };

  const toggleStatus = (task) => {
    const updatedTask = {
      ...task,
      status: task.status === "Completed" ? "Pending" : "Completed",
    };
    socket.emit("updateTask", updatedTask);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "completed") return task.status === "Completed";
    if (filter === "pending") return task.status !== "Completed";
    if (filter === "mine") return task.assignee === user.username;
    return true;
  });

  return (
    <ListContainer>
      <FilterBar>
        <FilterButton onClick={() => setFilter("all")} active={filter === "all"}>All</FilterButton>
        <FilterButton onClick={() => setFilter("completed")} active={filter === "completed"}>Completed</FilterButton>
        <FilterButton onClick={() => setFilter("pending")} active={filter === "pending"}>Pending</FilterButton>
        <FilterButton onClick={() => setFilter("mine")} active={filter === "mine"}>My Tasks</FilterButton>
      </FilterBar>

      <SearchInput
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks by title..."
      />

      {filteredTasks.map((task) => (
        <Card key={task.id}>
          <TaskInfo>
            <TaskTitle>{task.title}</TaskTitle>
            <TaskMeta>{task.desc}</TaskMeta>
            <TaskMeta>Deadline: {task.deadline}</TaskMeta>
            <Assignee>
              <FaUserCircle /> {task.assignee}
            </Assignee>
            <StatusTag
              status={task.status || "Pending"}
              onClick={() => toggleStatus(task)}
              title="Click to toggle status"
            >
              {task.status || "Pending"}
            </StatusTag>
            {(user.username === task.assignee || user.role === "admin") && (
              <ButtonGroup>
                <Button onClick={() => handleEdit(task.id)}>Edit</Button>
                <Button onClick={() => handleDelete(task.id)}>Delete</Button>
              </ButtonGroup>
            )}
          </TaskInfo>
        </Card>
      ))}
    </ListContainer>
  );
};

export default TaskList;