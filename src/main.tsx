import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from "react";

type Task = {
  description: string;
  completed: boolean;
};

export function Application() {
  const [tasks, setTasks] = useState<Task[]>([
    { description: "Create client", completed: true },
    { description: "Fetch from server", completed: false },
  ]);

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    setTasks(await res.json());
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
