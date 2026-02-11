import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from "react";
import type { TaskItem } from "./shared/TaskItem.js";

export function Application() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [description, setDescription] = useState("");

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    const data: TaskItem[] = await res.json();
    setTasks(data);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!description.trim()) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, completed: false }),
    });

    setDescription("");
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <h1>Task application</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button>Add</button>
      </form>

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
