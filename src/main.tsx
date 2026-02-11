import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h2>Home</h2>;
}

function Tasks() {
  return <h2>Tasks page</h2>;
}

export function Application() {
  return (
    <BrowserRouter>
      <h1>Task application</h1>

      <nav>
        <Link to="/">Home</Link> | <Link to="/tasks">Tasks</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("app")!).render(<Application />);
