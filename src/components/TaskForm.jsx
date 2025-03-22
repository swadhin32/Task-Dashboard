import React, { useState, useEffect } from "react";
import styled from "styled-components";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.3);
  color: #000;
  transition: box-shadow 0.2s;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.4);
  }

  ::placeholder {
    color: #333;
  }
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 10px;
  background: rgba(0, 123, 255, 0.6);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(0, 123, 255, 0.8);
    transform: scale(1.03);
  }
`;

const Heading = styled.h3`
  font-size: 1.4rem;
  color: rgba(0, 0, 0, 0.77);
  margin-bottom: 0.5rem;
  text-align: center;
`;

const TaskForm = ({ socket, editingTask, onCancel }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignee, setAssignee] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDesc(editingTask.desc);
      setDeadline(editingTask.deadline);
      setAssignee(editingTask.assignee);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !assignee) return;
    const task = {
      id: editingTask ? editingTask.id : Date.now(),
      title,
      desc,
      deadline,
      assignee,
    };
    socket.emit(editingTask ? "updateTask" : "addTask", task);
    setTitle("");
    setDesc("");
    setDeadline("");
    setAssignee("");
    if (onCancel) onCancel();
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Heading>{editingTask ? "Edit Task" : "Create New Task"}</Heading>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />
      <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      <Input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Assignee" />
      <Button type="submit">{editingTask ? "Update" : "Add"} Task</Button>
      {editingTask && <Button type="button" onClick={onCancel}>Cancel</Button>}
    </FormContainer>
  );
};

export default TaskForm;