import React, { useState, useEffect } from "react";

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
    <form onSubmit={handleSubmit} className="space-y-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />
      <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      <input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Assignee" />
      <button type="submit">{editingTask ? "Update" : "Add"} Task</button>
      {editingTask && <button onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default TaskForm;