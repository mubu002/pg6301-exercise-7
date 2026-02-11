import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from "react";
import type { TaskItem } from "./shared/TaskItem.js";

export function Application() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    const data: TaskItem[] = await res.json();
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <h1>Task application</h1>
      <ul>
        {tasks.map(({ description, completed }, index) => (
          <li key={index}>
            <input type="checkbox" checked={completed} readOnly />
            {description}
          </li>
        ))}
      </ul>
    </>
  );
}

createRoot(document.getElementById("app")!).render(<Application />);
