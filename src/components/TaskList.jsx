import React, { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import TaskForm from "./TaskForm";

const TaskList = ({ socket }) => {
  const { tasks, user } = useGlobalContext();
  const [editTask, setEditTask] = useState(null);

  const canEdit = (task) => user.role === "admin" || task.assignee === user.username;

  const handleDelete = (id) => socket.emit("deleteTask", id);

  return (
    <div>
      <h3>Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.assignee} - {task.deadline}
            {canEdit(task) && (
              <>
                <button onClick={() => setEditTask(task)}>Edit</button>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {editTask && (
        <TaskForm
          socket={socket}
          editingTask={editTask}
          onCancel={() => setEditTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;
