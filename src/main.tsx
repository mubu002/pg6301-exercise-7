import { createRoot } from "react-dom/client";
import React from "react";

export function Application() {
  return <h1>Task application</h1>;
}

createRoot(document.getElementById("app")!).render(<Application />);
